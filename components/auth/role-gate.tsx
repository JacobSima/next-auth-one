"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGatePageProps {
  children: React.ReactNode,
  allowedRole: UserRole
}

const RoleGatePage = ({
  children,
  allowedRole
}: RoleGatePageProps) => {
  const role = useCurrentRole();

  if(role !== allowedRole) {
    return (
      <FormError message="You do not have persmission to view this content!" />
    );
  }

  return (
    <>{children}</>
  )
}

export default RoleGatePage;