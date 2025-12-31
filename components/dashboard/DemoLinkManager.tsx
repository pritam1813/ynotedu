"use client";

import React, { useState } from "react";
import type { Course, DemoLink, Category } from "@prisma/client";
import {
    createDemoLink,
    updateDemoLink,
    deleteDemoLink,
} from "@/app/actions/demoLinkActions";

interface CourseWithDemoLink extends Course {
    demoLink: DemoLink | null;
    category: Category;
}

interface DemoLinkManagerProps {
    courses: CourseWithDemoLink[];
}

export default function DemoLinkManager({ courses }: DemoLinkManagerProps) {
    const [selectedCourse, setSelectedCourse] = useState<CourseWithDemoLink | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    const openModal = (course: CourseWithDemoLink) => {
        setSelectedCourse(course);
        if (course.demoLink) {
            setTitle(course.demoLink.title);
            setUrl(course.demoLink.url);
            setDescription(course.demoLink.description || "");
        } else {
            setTitle("");
            setUrl("");
            setDescription("");
        }
        setIsModalOpen(true);
        setMessage(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
        setTitle("");
        setUrl("");
        setDescription("");
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const data = { title, url, description };
            let result;

            if (selectedCourse.demoLink) {
                // Update existing
                result = await updateDemoLink(selectedCourse.demoLink.id, data);
            } else {
                // Create new
                result = await createDemoLink(selectedCourse.id, data);
            }

            if (result.success) {
                setMessage({ type: "success", text: result.message || "Demo link saved!" });
                // Refresh the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to save demo link" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCourse?.demoLink) return;

        if (!confirm("Are you sure you want to delete this demo link?")) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await deleteDemoLink(selectedCourse.demoLink.id);

            if (result.success) {
                setMessage({ type: "success", text: result.message || "Demo link deleted!" });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to delete demo link" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred" });
        } finally {
            setIsLoading(false);
        }
    };

    if (courses.length === 0) {
        return (
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100 py-30 px-30">
                <div className="text-center py-60">
                    <i className="icon-book text-60 text-light-1 mb-20"></i>
                    <h3 className="text-20 fw-500 mb-10">No courses yet</h3>
                    <p className="text-light-1 mb-20">
                        Create a course first to add demo links.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
                <div className="py-30 px-30">
                    <table className="table w-100">
                        <thead>
                            <tr>
                                <th className="text-dark-1 fw-500 py-15">Course</th>
                                <th className="text-dark-1 fw-500 py-15">Category</th>
                                <th className="text-dark-1 fw-500 py-15">Demo Link Status</th>
                                <th className="text-dark-1 fw-500 py-15 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id} className="border-top-light">
                                    <td className="py-15">
                                        <div className="d-flex items-center">
                                            <div
                                                className="size-50 rounded-8 bg-image mr-15"
                                                style={{
                                                    backgroundImage: course.thumbnail
                                                        ? `url(${course.thumbnail})`
                                                        : "url(/assets/img/coursesCards/9.png)",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            ></div>
                                            <div>
                                                <div className="text-dark-1 fw-500">{course.title}</div>
                                                <div className="text-light-1 text-13">
                                                    {course.isPublished ? "Published" : "Draft"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-15 text-light-1">{course.category.label}</td>
                                    <td className="py-15">
                                        {course.demoLink ? (
                                            <span className="badge px-15 py-8 text-11 bg-green-1 text-white">
                                                Demo Added
                                            </span>
                                        ) : (
                                            <span className="badge px-15 py-8 text-11 bg-light-4 text-dark-1">
                                                No Demo
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-15 text-end">
                                        <button
                                            onClick={() => openModal(course)}
                                            className="button -sm -purple-1 text-white"
                                        >
                                            {course.demoLink ? "Edit Demo" : "Add Demo"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedCourse && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div
                        className="bg-white rounded-16 shadow-4"
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            maxHeight: "90vh",
                            overflow: "auto",
                        }}
                    >
                        <div className="py-20 px-30 border-bottom-light d-flex justify-between items-center">
                            <h3 className="text-20 fw-500">
                                {selectedCourse.demoLink ? "Edit Demo Link" : "Add Demo Link"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-light-1"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <i className="icon-close text-20"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form py-30 px-30">
                            <div className="col-12 mb-20">
                                <label className="text-14 fw-500 text-dark-1 mb-8">
                                    Course
                                </label>
                                <div className="text-light-1">{selectedCourse.title}</div>
                            </div>

                            <div className="col-12 mb-20">
                                <label className="text-14 fw-500 text-dark-1 mb-8">
                                    Demo Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Course Introduction"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-20">
                                <label className="text-14 fw-500 text-dark-1 mb-8">
                                    Demo Video URL *
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="form-control"
                                    required
                                />
                                <p className="text-light-1 text-13 mt-5">
                                    Enter a YouTube, Vimeo, or other video URL
                                </p>
                            </div>

                            <div className="mb-20">
                                <label className="text-14 fw-500 text-dark-1 mb-8">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of what's covered in the demo"
                                    className="form-control"
                                    rows={3}
                                />
                            </div>

                            {message && (
                                <div
                                    className={`mb-20 py-10 px-15 rounded-8 ${message.type === "success" ? "bg-green-1 text-white" : "bg-red-1 text-white"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <div className="d-flex justify-between">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="button -sm -purple-1 text-white"
                                >
                                    {isLoading ? "Saving..." : "Save Demo Link"}
                                </button>

                                {selectedCourse.demoLink && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        className="button -sm -outline-red-1 text-red-1"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
