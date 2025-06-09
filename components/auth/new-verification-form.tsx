"use client";

import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./card-wrapper";
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (error || success) {
      return
    }

    if (!token) {
      setError("Missing token");
      return;
    }

    // Server Action
    newVerification(token)
      .then(data => {
        setSuccess(data.succes);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items center w-full justify-center">
        {
          !success && !error && <BeatLoader />
        }
        <FormSuccess message={success} />
        {
          !success && <FormError message={error} />
        }
      </div>
    </CardWrapper>
  )
}