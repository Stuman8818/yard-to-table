"use client";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from "@apollo/client/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { CreateLeadDocument } from "@/graphql/generated/graphql";
import {
  customerServiceCategories,
  type CustomerServiceType,
  type ServiceDetailType,
} from "@/lib/services";
import {
  getLeadFieldErrors,
  leadSubmissionSchema,
  type LeadFieldErrors,
  type LeadSubmissionField,
} from "@/lib/validation/lead";

type TextField = Exclude<LeadSubmissionField, "serviceTypes" | "serviceDetails" | "desiredTiming">;

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: "IN";
  postalCode: string;
  email: string;
  serviceTypes: CustomerServiceType[];
  serviceDetails: ServiceDetailType[];
  message: string;
};

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "IN",
  postalCode: "",
  email: "",
  serviceTypes: [],
  serviceDetails: [],
  message: "",
};

function getServerFieldErrors(error: unknown): LeadFieldErrors | null {
  if (!CombinedGraphQLErrors.is(error)) {
    return null;
  }

  const fieldErrors = error.errors.find(
    (graphQLError) => graphQLError?.extensions?.code === "BAD_USER_INPUT",
  )?.extensions?.fieldErrors;

  if (!fieldErrors || typeof fieldErrors !== "object") {
    return null;
  }

  const safeErrors: LeadFieldErrors = {};

  for (const field of Object.keys(initialValues) as LeadSubmissionField[]) {
    const message = Reflect.get(fieldErrors, field);

    if (typeof message === "string") {
      safeErrors[field] = message;
    }
  }

  return safeErrors;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null);
  const submissionInProgress = useRef(false);
  const [submitLead, { loading }] = useMutation(CreateLeadDocument);

  function updateField(field: TextField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleCategory(categoryId: CustomerServiceType) {
    const category = customerServiceCategories.find(({ id }) => id === categoryId);

    if (!category) {
      return;
    }

    setValues((current) => {
      if (!current.serviceTypes.includes(categoryId)) {
        return { ...current, serviceTypes: [...current.serviceTypes, categoryId] };
      }

      const categoryDetails = new Set<string>(category.services.map(({ id }) => id));
      return {
        ...current,
        serviceTypes: current.serviceTypes.filter((value) => value !== categoryId),
        serviceDetails: current.serviceDetails.filter((value) => !categoryDetails.has(value)),
      };
    });
    setFieldErrors((current) => ({
      ...current,
      serviceTypes: undefined,
      serviceDetails: undefined,
    }));
  }

  function toggleServiceDetail(detail: ServiceDetailType) {
    setValues((current) => ({
      ...current,
      serviceDetails: current.serviceDetails.includes(detail)
        ? current.serviceDetails.filter((value) => value !== detail)
        : [...current.serviceDetails, detail],
    }));
    setFieldErrors((current) => ({ ...current, serviceDetails: undefined }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (submissionInProgress.current) {
      return;
    }

    setStatus(null);
    const parsed = leadSubmissionSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(getLeadFieldErrors(parsed.error));
      setStatus({ ok: false, message: "Please correct the highlighted fields." });
      return;
    }

    setFieldErrors({});
    submissionInProgress.current = true;

    try {
      const result = await submitLead({
        variables: {
          input: { ...parsed.data, state: "IN" },
        },
      });

      if (!result.data?.createLead.success) {
        throw new Error("Lead submission did not complete.");
      }

      setValues(initialValues);
      setStatus({ ok: true, message: "Thanks—your estimate request has been received." });
    } catch (error: unknown) {
      const serverFieldErrors = getServerFieldErrors(error);

      if (serverFieldErrors) {
        setFieldErrors(serverFieldErrors);
        setStatus({ ok: false, message: "Please correct the highlighted fields." });
      } else {
        setStatus({
          ok: false,
          message: "We couldn’t submit your request. Please try again.",
        });
      }
    } finally {
      submissionInProgress.current = false;
    }
  }

  const fieldDescription = (field: TextField) =>
    fieldErrors[field] ? `${field}-error` : undefined;
  const inputClassName =
    "w-full rounded-lg border border-[#cfd8d0] bg-[#fbfcf9] px-3.5 py-2.5 text-[#23332a] placeholder:text-[#89948d] focus:border-[#52725e] focus:ring-2 focus:ring-[#52725e]/15 focus:outline-none";
  const selectedCategories = customerServiceCategories.filter(({ id }) =>
    values.serviceTypes.includes(id),
  );
  const notSureSelected = values.serviceTypes.includes("NOT_SURE");

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-2xl text-left text-sm font-medium text-[#34443b]"
    >
      <fieldset
        aria-describedby={`serviceTypes-description${fieldErrors.serviceTypes ? " serviceTypes-error" : ""}`}
      >
        <legend className="text-lg font-semibold text-[#263a2f]">What can we help with?</legend>
        <p id="serviceTypes-description" className="mt-1 text-sm font-normal text-[#66746b]">
          Select everything that applies. We’ll help determine the final scope.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {customerServiceCategories.map((category) => {
            const selected = values.serviceTypes.includes(category.id);

            return (
              <label
                key={category.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                  selected
                    ? "border-[#416b53] bg-[#e7efe5] shadow-[inset_0_0_0_1px_#416b53]"
                    : "border-[#d5ded2] bg-white hover:border-[#9eb49f]"
                }`}
              >
                <input
                  type="checkbox"
                  name="serviceTypes"
                  value={category.id}
                  checked={selected}
                  onChange={() => toggleCategory(category.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#315f46]"
                />
                <span>
                  <span className="block font-semibold text-[#2a4033]">{category.label}</span>
                  <span className="mt-1 block text-xs font-normal leading-5 text-[#66746b]">
                    {category.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {fieldErrors.serviceTypes && (
          <p id="serviceTypes-error" className="mt-2 text-sm text-red-700">
            {fieldErrors.serviceTypes}
          </p>
        )}
      </fieldset>

      {selectedCategories.some(({ services }) => services.length > 0) && (
        <section className="mt-6 rounded-xl border border-[#dbe2d8] bg-[#f5f7f2] p-4 sm:p-5">
          <h2 className="font-semibold text-[#2a4033]">Any specific services?</h2>
          <p className="mt-1 text-xs font-normal text-[#66746b]">
            Optional—choose any that apply, or leave this blank.
          </p>
          <div className="mt-4 space-y-5">
            {selectedCategories.map((category) =>
              category.services.length > 0 ? (
                <fieldset key={category.id}>
                  <legend className="text-sm font-semibold text-[#405247]">{category.label}</legend>
                  <div className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    {category.services.map((service) => (
                      <label
                        key={service.id}
                        className="flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-1.5 font-normal text-[#526158]"
                      >
                        <input
                          type="checkbox"
                          name="serviceDetails"
                          value={service.id}
                          checked={values.serviceDetails.includes(service.id)}
                          onChange={() => toggleServiceDetail(service.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#315f46]"
                        />
                        <span>{service.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null,
            )}
          </div>
          {fieldErrors.serviceDetails && (
            <p id="serviceDetails-error" className="mt-2 text-sm text-red-700">
              {fieldErrors.serviceDetails}
            </p>
          )}
        </section>
      )}

      <div
        className={`mt-6 rounded-xl p-4 sm:p-5 ${
          notSureSelected ? "border-2 border-[#78957e] bg-[#eef3e9]" : "border border-[#dbe2d8]"
        }`}
      >
        <label htmlFor="contact-message" className="block text-lg font-semibold text-[#2a4033]">
          Tell us about your project
        </label>
        <p id="message-help" className="mt-1 text-xs font-normal leading-5 text-[#66746b]">
          Describe what you’d like help with, any problems you’re trying to solve, or anything else
          we should know.
        </p>
        <textarea
          id="contact-message"
          required
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={`message-help${fieldErrors.message ? " message-error" : ""}`}
          className={`${inputClassName} mt-3 min-h-36`}
          rows={6}
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-700">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <section className="mt-8 border-t border-[#dbe2d8] pt-7">
        <h2 className="text-lg font-semibold text-[#263a2f]">Your contact and property details</h2>
        <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <Field label="First name" field="firstName" error={fieldErrors.firstName}>
            <input
              id="contact-firstName"
              required
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              aria-invalid={Boolean(fieldErrors.firstName)}
              aria-describedby={fieldDescription("firstName")}
              className={inputClassName}
            />
          </Field>

          <Field label="Last name" field="lastName" error={fieldErrors.lastName}>
            <input
              id="contact-lastName"
              required
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              aria-invalid={Boolean(fieldErrors.lastName)}
              aria-describedby={fieldDescription("lastName")}
              className={inputClassName}
            />
          </Field>

          <Field label="Phone number" field="phone" error={fieldErrors.phone}>
            <input
              id="contact-phone"
              required
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldDescription("phone")}
              className={inputClassName}
            />
          </Field>

          <Field label="Email address" field="email" error={fieldErrors.email}>
            <input
              id="contact-email"
              required
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldDescription("email")}
              className={inputClassName}
            />
          </Field>

          <Field label="Street address" field="address" error={fieldErrors.address} wide>
            <input
              id="contact-address"
              required
              autoComplete="street-address"
              value={values.address}
              onChange={(event) => updateField("address", event.target.value)}
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={fieldDescription("address")}
              className={inputClassName}
            />
          </Field>

          <Field label="City" field="city" error={fieldErrors.city}>
            <input
              id="contact-city"
              required
              autoComplete="address-level2"
              value={values.city}
              onChange={(event) => updateField("city", event.target.value)}
              aria-invalid={Boolean(fieldErrors.city)}
              aria-describedby={fieldDescription("city")}
              className={inputClassName}
            />
          </Field>

          <Field label="State" field="state" error={fieldErrors.state}>
            <input
              id="contact-state"
              required
              disabled
              autoComplete="address-level1"
              value={values.state}
              aria-invalid={Boolean(fieldErrors.state)}
              aria-describedby="state-help"
              className={`${inputClassName} cursor-not-allowed bg-[#edf0ea] text-[#6f7973]`}
            />
            <p id="state-help" className="mt-1.5 text-xs font-normal text-[#6e7a72]">
              Yard To Table currently serves properties in Indiana.
            </p>
          </Field>

          <Field label="ZIP code" field="postalCode" error={fieldErrors.postalCode}>
            <input
              id="contact-postalCode"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              value={values.postalCode}
              onChange={(event) => updateField("postalCode", event.target.value)}
              aria-invalid={Boolean(fieldErrors.postalCode)}
              aria-describedby={fieldDescription("postalCode")}
              className={inputClassName}
            />
          </Field>
        </div>
      </section>

      <div className="mt-7">
        <p className="mb-3 text-xs font-normal leading-5 text-[#66746b]">
          We’ll review your request and follow up to discuss the property and next steps.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#214d3c] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#173f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Request an Estimate"}
          </button>
          <div className="flex items-center gap-2" aria-label="Powered by Trellis">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#778179]">
              Powered by
            </span>
            <span className="relative h-10 w-28 overflow-hidden" aria-hidden="true">
              <Image src="/Trellis Logo.png" alt="" fill sizes="112px" className="object-cover" />
            </span>
          </div>
        </div>
        <div className="mt-3">
          {status && (
            <p
              role={status.ok ? "status" : "alert"}
              aria-live={status.ok ? "polite" : "assertive"}
              className={`rounded-md px-3 py-2 text-sm ${
                status.ok ? "bg-[#e8f1e6] text-[#28543c]" : "bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  field,
  error,
  wide = false,
  children,
}: {
  label: string;
  field: TextField;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={`contact-${field}`} className="mb-1.5 block font-semibold text-[#34443b]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${field}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
