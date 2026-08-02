"use client";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from "@apollo/client/react";
import { useRef, useState } from "react";

import { CreateLeadDocument } from "@/graphql/generated/graphql";
import {
  getLeadFieldErrors,
  leadSubmissionSchema,
  type LeadFieldErrors,
  type LeadSubmissionField,
} from "@/lib/validation/lead";
import { serviceDefinitions, type ServiceType } from "@/lib/services";

const initialValues = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "IN" as const,
  postalCode: "",
  email: "",
  serviceTypes: ["LAWN_CARE"] as ServiceType[],
  message: "",
};

type FormValues = typeof initialValues;

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

  function updateField(field: Exclude<LeadSubmissionField, "serviceTypes">, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleService(serviceType: ServiceType) {
    if (!serviceDefinitions[serviceType].enabled) {
      return;
    }

    setValues((current) => ({
      ...current,
      serviceTypes: current.serviceTypes.includes(serviceType)
        ? current.serviceTypes.filter((value) => value !== serviceType)
        : [...current.serviceTypes, serviceType],
    }));
    setFieldErrors((current) => ({ ...current, serviceTypes: undefined }));
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
      setStatus({ ok: true, message: "Your request was submitted. We’ll be in touch soon." });
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

  const fieldDescription = (field: Exclude<LeadSubmissionField, "serviceTypes">) =>
    fieldErrors[field] ? `${field}-error` : undefined;
  const inputClassName =
    "w-full rounded-md border bg-transparent px-3 py-2 font-semibold text-white placeholder:text-white/75 focus:ring-2 focus:ring-white focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-2xl bg-[#8f6641] text-left font-semibold text-white"
    >
      <div className="grid gap-4 bg-[#8f6641] sm:grid-cols-2">
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
            className={`${inputClassName} cursor-not-allowed bg-white/15 opacity-80`}
          />
          <p id="state-help" className="mt-1 text-sm font-normal text-white/90">
            Currently serving Indiana only.
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

        <Field label="Email address" field="email" error={fieldErrors.email} wide>
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

        <fieldset
          className="sm:col-span-2"
          aria-describedby="serviceTypes-description serviceTypes-error"
        >
          <legend className="mb-2 text-sm">Services needed</legend>
          <p id="serviceTypes-description" className="mb-3 text-sm text-white/90">
            Select every service you would like to discuss.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              Object.entries(serviceDefinitions) as [
                ServiceType,
                (typeof serviceDefinitions)[ServiceType],
              ][]
            ).map(([serviceType, definition]) => (
              <label
                key={serviceType}
                className="flex cursor-pointer gap-3 rounded-md border border-white/60 p-3"
              >
                <input
                  type="checkbox"
                  name="serviceTypes"
                  value={serviceType}
                  checked={values.serviceTypes.includes(serviceType)}
                  disabled={!definition.enabled}
                  onChange={() => toggleService(serviceType)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#1eb21e] disabled:cursor-not-allowed"
                />
                <span>
                  <span className="flex items-center gap-2">
                    <span>{definition.label}</span>
                    {!definition.enabled && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        Coming soon
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm font-normal text-white/90">
                    {definition.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {fieldErrors.serviceTypes && (
            <p id="serviceTypes-error" className="mt-1 text-sm text-red-100">
              {fieldErrors.serviceTypes}
            </p>
          )}
        </fieldset>

        <Field label="Notes" field="message" error={fieldErrors.message} wide>
          <textarea
            id="contact-message"
            required
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldDescription("message")}
            className={inputClassName}
            rows={5}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full border-2 border-[#1eb21e] bg-white px-6 py-2 text-base font-semibold text-black transition hover:bg-[#8f6641] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Send Request"}
        </button>
        {status && (
          <p
            role={status.ok ? "status" : "alert"}
            aria-live={status.ok ? "polite" : "assertive"}
            className={`rounded-md bg-white px-3 py-2 text-sm ${status.ok ? "text-green-800" : "text-red-700"}`}
          >
            {status.message}
          </p>
        )}
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
  field: Exclude<LeadSubmissionField, "serviceTypes">;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={`contact-${field}`} className="mb-1 block text-sm">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${field}-error`} className="mt-1 text-sm text-red-100">
          {error}
        </p>
      )}
    </div>
  );
}
