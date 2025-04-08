import EditJoinUsPage from "@/components/pages/join-us-form/EditJoinUsPage";
import Breadcrumb from "@/components/partials/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/partials/Layouts/DefaultLayout";

const JoinUsPage = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
            <Breadcrumb pageName="Join Us Form" />
                <EditJoinUsPage />
            </div>
        </DefaultLayout>
    );
};

export default JoinUsPage;
