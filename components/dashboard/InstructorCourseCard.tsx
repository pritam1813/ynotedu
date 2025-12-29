"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { deleteCourse, togglePublishStatus } from "@/app/actions/instructorCourseActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface InstructorCourseCardProps {
    course: {
        id: number;
        title: string;
        description: string;
        level: string;
        language: string;
        thumbnail: string;
        price: number;
        isPublished: boolean;
        categoryName: string;
        sectionsCount: number;
        contentsCount: number;
    };
}

export default function InstructorCourseCard({ course }: InstructorCourseCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteCourse(course.id);

            if (result.success) {
                toast.success(result.message);
                setShowDeleteModal(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete course");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTogglePublish = async () => {
        setIsToggling(true);
        try {
            const result = await togglePublishStatus(course.id);

            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update course status");
            }
        } catch (error) {
            console.error("Toggle publish error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <>
            <div className="w-1/5 xl:w-1/3 lg:w-1/2 sm:w-1/1">
                <div className="relative">
                    {course.thumbnail ? (
                        <Image
                            width={560}
                            height={325}
                            className="rounded-8 w-1/1"
                            src={course.thumbnail}
                            alt={course.title}
                        />
                    ) : (
                        <div
                            className="rounded-8 w-1/1 bg-light-4 d-flex items-center justify-center"
                            style={{ height: "180px" }}
                        >
                            <span className="text-light-1">No thumbnail</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div
                        className={`absolute top-10 left-10 px-15 py-5 rounded-8 text-11 fw-500 ${course.isPublished
                                ? "bg-green-1 text-white"
                                : "bg-orange-1 text-white"
                            }`}
                    >
                        {course.isPublished ? "Published" : "Draft"}
                    </div>

                    {/* Menu Button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="absolute-button"
                    >
                        <span className="d-flex items-center justify-center size-35 bg-white shadow-1 rounded-8">
                            <i className="icon-menu-vertical"></i>
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="toggle-element -dshb-more -is-el-visible">
                            <div className="px-25 py-25 bg-white -dark-bg-dark-2 shadow-1 border-light rounded-8">
                                <Link
                                    href={`/dshb-listing?courseid=${course.id}`}
                                    className="d-flex items-center"
                                >
                                    <div className="icon-edit"></div>
                                    <div className="text-17 lh-1 fw-500 ml-12">Edit</div>
                                </Link>

                                <button
                                    onClick={handleTogglePublish}
                                    disabled={isToggling}
                                    className="d-flex items-center mt-20 border-0 bg-transparent cursor-pointer"
                                >
                                    <div className={course.isPublished ? "icon-eye-off" : "icon-eye"}></div>
                                    <div className="text-17 lh-1 fw-500 ml-12">
                                        {isToggling ? "Updating..." : course.isPublished ? "Unpublish" : "Publish"}
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowDeleteModal(true);
                                    }}
                                    className="d-flex items-center mt-20 border-0 bg-transparent cursor-pointer text-red-1"
                                >
                                    <div className="icon-bin"></div>
                                    <div className="text-17 lh-1 fw-500 ml-12">Delete</div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-15">
                    <div className="d-flex y-gap-10 justify-between items-center">
                        <div className="text-14 lh-1">{course.categoryName}</div>
                        <div className="d-flex items-center">
                            <span className="text-14 text-light-1">{course.level}</span>
                        </div>
                    </div>

                    <h3 className="text-16 fw-500 lh-15 mt-10">{course.title}</h3>

                    <div className="d-flex y-gap-10 justify-between items-center mt-10">
                        <div className="text-14 text-light-1">
                            {course.sectionsCount} sections • {course.contentsCount} items
                        </div>
                        <div className="text-14 fw-500 text-purple-1">
                            ₹{course.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal -centered -dark-bg-dark-1 is-active"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div className="modal__content bg-white -dark-bg-dark-1 rounded-16 px-40 py-40" style={{ maxWidth: "400px" }}>
                        <h3 className="text-20 fw-500 mb-15">Delete Course?</h3>
                        <p className="text-light-1 mb-30">
                            Are you sure you want to delete "{course.title}"? This action cannot be undone.
                        </p>
                        <div className="d-flex x-gap-15">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="button -md -outline-dark-1 text-dark-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="button -md -red-1 text-white"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay to close menu */}
            {showMenu && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10
                    }}
                    onClick={() => setShowMenu(false)}
                />
            )}
        </>
    );
}
