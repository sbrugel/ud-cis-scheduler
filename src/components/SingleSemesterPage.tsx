import React, { useState } from "react";
import { SemesterView } from "./SemesterView";
import { Semester } from "../interfaces/semester";
import { Button, Form } from "react-bootstrap";
import { CourseOption } from "../interfaces/courseoption";
import { Course } from "../interfaces/course";
import { DegreePlan } from "../interfaces/degreePlan";

/**
 * A page that allows one to edit a single semester.
 *
 * @param sem The semester being edited.
 *
 * @param degreePlan The degree plan this semester is in.
 *
 * @param setCurrentSemester This is a function which sets the current semester to a Semester object or null.
 * (SEE: setCurrentSemester in App.tsx; that's what gets passed into here)
 * In this case, we use it to update the semester data when we change something.
 *
 * @param updatePlan This function updates the plan containing this semester.
 * (SEE: updateDegreePlan in App.tsx; that's what gets passed into here)
 */
export function SingleSemesterPage({
    sem,
    degreePlan,
    setCurrentSemester,
    updatePlan
}: {
    sem: Semester;
    degreePlan: DegreePlan;
    setCurrentSemester: (newSem: Semester | null) => void;
    updatePlan: (newPlan: DegreePlan, exit: boolean) => void;
}) {
    // the list of course options in the dropdown, aka the courses that can be added to a semester
    const [courseOptions, setCourseOptions] = useState<CourseOption[]>([
        {
            course: {
                code: "CISC108",
                name: "Introduction to Computer Science I",
                credits: 3
            },
            prereqs: ""
        },
        {
            course: {
                code: "CISC181",
                name: "Introduction to Computer Science II",
                credits: 3
            },
            prereqs: "CISC106 or CISC108"
        },
        {
            course: {
                code: "CISC210",
                name: "Introduction to Systems Programming",
                credits: 3
            },
            prereqs: "CISC106 or CISC108"
        },
        {
            course: {
                code: "CISC220",
                name: "Data Structures",
                credits: 3
            },
            prereqs: "CISC210"
        },
        {
            course: {
                code: "CISC260",
                name: "Machine Organization and Assembly Language",
                credits: 3
            },
            prereqs: "CISC210"
        },
        {
            course: {
                code: "CISC275",
                name: "Introduction to Software Engineering",
                credits: 3
            },
            prereqs: "CISC181, CISC220"
        },
        {
            course: {
                code: "CISC303",
                name: "Automata Theory",
                credits: 3
            },
            prereqs: "CISC220, MATH210"
        },
        {
            course: {
                code: "CISC320",
                name: "Algorithms",
                credits: 3
            },
            prereqs: "CISC220, MATH210"
        },
        {
            course: {
                code: "CISC361",
                name: "Operating Systems",
                credits: 3
            },
            prereqs: "CISC220, CISC260"
        },
        {
            course: {
                code: "CISC372",
                name: "Parallel Computing",
                credits: 3
            },
            prereqs: "CISC220, CISC260"
        }
    ]);

    // the code of the currently selected course to add
    const [currentSelectedCourse, setCurrentSelectedCourse] = useState<string>(
        courseOptions[0].course.code
    );
    const updateCurrentSelectedCourse = (
        event: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setCurrentSelectedCourse(event.target.value);
    };

    /**
     * Adds a new course to the semester and updates the plan containing it accordingly.
     * @param course The course that is currently selected in the newCourse form
     */
    const addCourseToSemester = (course: Course) => {
        // the updated semester
        const newSemester = { ...sem, courses: [...sem.courses, course] };
        setCurrentSemester(newSemester);

        // the updated list of semesters for this plan
        const updatedPlanSemesters = degreePlan.semesters.map(
            (semester: Semester): Semester => {
                return semester.season === newSemester.season &&
                    semester.year === newSemester.year
                    ? newSemester
                    : semester;
            }
        );

        // actually update this plan's semester data
        const updatedPlan: DegreePlan = {
            ...degreePlan,
            semesters: updatedPlanSemesters
        };
        updatePlan(updatedPlan, false);
    };

    return (
        <>
            <Button
                onClick={() => setCurrentSemester(null)}
                className="btn btn-danger"
            >
                Go Back
            </Button>
            <b>
                <u>
                    <h5>Edit This Semester</h5>
                </u>
            </b>
            <SemesterView
                sem={sem}
                editMode={true}
                setCurrentSemester={setCurrentSemester}
                deleteThisSem={() => {
                    throw ""; // we don't have a Delete button in edit mode
                }}
            />
            <b>
                <u>
                    <h6>Add a New Course</h6>
                </u>
            </b>
            <Form.Group controlId="newCourse">
                <Form.Select
                    value={currentSelectedCourse}
                    onChange={updateCurrentSelectedCourse}
                >
                    {courseOptions.map((courseOption: CourseOption) => (
                        <option
                            key={courseOption.course.code}
                            value={courseOption.course.code}
                        >
                            {courseOption.course.code}
                        </option>
                    ))}
                </Form.Select>
                <Button
                    variant="success"
                    onClick={() => {
                        const foundCourse = courseOptions.find(
                            (option: CourseOption): boolean =>
                                option.course.code === currentSelectedCourse
                        );
                        if (foundCourse) {
                            // theoretically this should never be null
                            addCourseToSemester(foundCourse.course);
                        }
                    }}
                >
                    OK
                </Button>
            </Form.Group>
        </>
    );
}
