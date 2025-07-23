import { redirect } from "next/navigation";
import SuperAdminSignup from "../../components/Backend/superAdminSignup/SuperAdminSignup";
import ClientAdminSignup from "../../components/Backend/clientAdminSignup/ClientAdminSignup";
import {
  getClientAdminStatus,
  getSuperAdminStatus,
} from "../../utils/globalStore";
import { auth } from "../../auth";

const IamAdminPage = async () => {
  const session = await auth();

  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect(`/dashboard/pages/${session.user.role}`);
  }

  // Fetch admin status
  const [isSuperAdminCreated, isClientAdminCreated] = await Promise.all([
    getSuperAdminStatus(),
    getClientAdminStatus(),
  ]);

  // Redirect to signin if both admins exist
  if (isSuperAdminCreated && isClientAdminCreated) {
    redirect("/api/auth/signin");
  }

  // Render appropriate component
  if (!isSuperAdminCreated) {
    return <SuperAdminSignup />;
  }

  if (!isClientAdminCreated) {
    return <ClientAdminSignup />;
  }

  return null;
};

export default IamAdminPage;
