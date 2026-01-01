import React from "react";
import { getInstructorCoursesWithDemoLinks } from "@/app/actions/demoLinkActions";
import DemoLinkManager from "@/components/dashboard/DemoLinkManager";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Demo Links || ynotedu - Professional LMS Online Education",
    description: "Manage demo links for your courses.",
};

export default async function DemoLinksPage() {
    const result = await getInstructorCoursesWithDemoLinks();

    if (!result.success || !result.courses) {
        return (
            <div className="dashboard__main">
                <div className="dashboard__content bg-light-4">
                    <div className="row pb-50 mb-10">
                        <div className="col-auto">
                            <h1 className="text-30 lh-12 fw-700">Demo Links</h1>
                            <p className="text-light-1 mt-10">
                                Add demo video links to your courses for potential students to preview.
                            </p>
                        </div>
                    </div>

                    <div className="row y-gap-30">
                        <div className="col-12">
                            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100 py-30 px-30">
                                <p className="text-center text-red-1">{result.error || "Failed to load courses"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard__main">
            <div className="dashboard__content bg-light-4">
                <div className="row pb-50 mb-10">
                    <div className="col-auto">
                        <h1 className="text-30 lh-12 fw-700">Demo Links</h1>
                        <p className="text-light-1 mt-10">
                            Add demo video links to your courses for potential students to preview.
                        </p>
                    </div>
                </div>

                <div className="row y-gap-30">
                    <div className="col-12">
                        <DemoLinkManager courses={result.courses} />
                    </div>
                </div>
            </div>
        </div>
    );
}
