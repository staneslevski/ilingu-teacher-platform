// action types
import {
  // students actions
  GET_STUDENT_START,
  GET_STUDENT_RETURN,
  UPDATE_STUDENT_START,
  UPDATE_STUDENT_RETURN,
  LIST_STUDENTS_START,
  LIST_STUDENTS_RETURN,
  // teachers actions
  GET_TEACHER_START,
  GET_TEACHER_RETURN,
  UPDATE_TEACHER_START,
  UPDATE_TEACHER_RETURN,
  LIST_TEACHERS_START,
  LIST_TEACHERS_RETURN,
  // courses actions
  GET_COURSE_START,
  GET_COURSE_RETURN,
  UPDATE_COURSE_START,
  UPDATE_COURSE_RETURN,
  LIST_COURSES_START,
  LIST_COURSES_RETURN,
  DELETE_COURSE_START,
  DELETE_COURSE_RETURN,
  // enrolments actions
  CREATE_ENROLMENT_START,
  CREATE_ENROLMENT_RETURN,
  GET_ENROLMENT_START,
  GET_ENROLMENT_RETURN,
  UPDATE_ENROLMENT_START,
  UPDATE_ENROLMENT_RETURN,
  LIST_ENROLMENTS_START,
  LIST_ENROLMENTS_RETURN,
  // lessons actions
  GET_LESSON_START,
  GET_LESSON_RETURN,
  UPDATE_LESSON_START,
  UPDATE_LESSON_RETURN,
  LIST_LESSONS_START,
  LIST_LESSONS_RETURN,
  // product actions
  GET_PRODUCT_START,
  GET_PRODUCT_RETURN,
  UPDATE_PRODUCT_START,
  UPDATE_PRODUCT_RETURN,
  LIST_PRODUCTS_START,
  LIST_PRODUCTS_RETURN,
  CREATE_PRODUCT_START,
  CREATE_PRODUCT_RETURN
} from "../action-types";

import { getErrorMessage } from "./messageInfo";

// students API functions
import {getStudentAPI} from "../../libs/ilingu-libs/Students/CRUD/get";
import {updateStudentAPI} from "../../libs/ilingu-libs/Students/CRUD/update";
import {listStudentsAPI} from "../../libs/ilingu-libs/Students/CRUD/list";

// teachers API functions
import {getTeacherAPI} from "../../libs/ilingu-libs/Teachers/CRUD/get";
import {updateTeacherAPI} from "../../libs/ilingu-libs/Teachers/CRUD/update";
import {listTeachersAPI} from "../../libs/ilingu-libs/Teachers/CRUD/list";

// courses API functions
import {getCourseAPI} from "../../libs/ilingu-libs/Courses/CRUD/get";
import {updateCourseAPI} from "../../libs/ilingu-libs/Courses/CRUD/update";
import {listCoursesAPI} from "../../libs/ilingu-libs/Courses/CRUD/list";
import {deleteCourseAPI} from "../../libs/ilingu-libs/Courses/CRUD/delete";


// lessons API functions
import {getLessonAPI} from "../../libs/ilingu-libs/Lessons/CRUD/get";
import {updateLessonAPI} from "../../libs/ilingu-libs/Lessons/CRUD/update";
import {listLessonsAPI} from "../../libs/ilingu-libs/Lessons/CRUD/list";

// products API functions
import {createProductAPI} from "../../libs/ilingu-libs/products/CRUD/create";
import {getProductAPI} from "../../libs/ilingu-libs/products/CRUD/get";
import {updateProductAPI} from "../../libs/ilingu-libs/products/CRUD/update";
import {listProductsAPI} from "../../libs/ilingu-libs/products/CRUD/list";

// enrolments API functions
import {createEnrolmentAPI} from "../../libs/ilingu-libs/Enrolments/CRUD/create";
import {getEnrolmentAPI} from "../../libs/ilingu-libs/Enrolments/CRUD/get";
import {updateEnrolmentAPI} from "../../libs/ilingu-libs/Enrolments/CRUD/update";
import {listEnrolmentsAPI} from "../../libs/ilingu-libs/Enrolments/CRUD/list";

import * as Sentry from "@sentry/browser";
import config from "../../config";

// trial form functions
Sentry.init(config.sentry);

// products actions
export const createProductStart = () => ({
  type: CREATE_PRODUCT_START,
  isLoadingProducts: true,
});
export const createProductReturn = (createdProduct) => ({
  type: CREATE_PRODUCT_RETURN,
  isLoadingProducts: false,
  product: createdProduct,
});
export function createProduct(protoProduct) {
  return function(dispatch) {
    dispatch(createProductStart());

    return createProductAPI(protoProduct).then(
      response => dispatch(createProductReturn(response)),
      error => {
        Sentry.captureException(error);
        console.log(error);
    })
  }
}

export const getProductStart = () => ({
  type: GET_PRODUCT_START,
  isLoadingProducts: true,
});
export const getProductReturn = (product) => ({
  type: GET_PRODUCT_RETURN,
  isLoadingProducts: false,
  product: product,
});
export function getProduct(productId) {
  return function(dispatch) {
    dispatch(getProductStart());

    return getProductAPI(productId).then(
      response => dispatch(getProductReturn(response)),
      error => {
        Sentry.captureException(error);
        console.log(error);
      }
    )
  }
}

export const updateProductStart = () => ({
  type: UPDATE_PRODUCT_START,
  isLoadingProducts: true,
});
export const updateProductReturn = (product) => ({
  type: UPDATE_PRODUCT_RETURN,
  isLoadingProducts: false,
  products: product,
});
export function updateProduct(productId, updateData) {
  return function(dispatch) {
    dispatch(updateProductStart());

    return updateProductAPI(productId, updateData).then(
      response => dispatch(updateProductReturn(response)),
      error => {
        Sentry.captureException(error);
        console.log(error);
      }
    )
  }
}

export const listProductsStart = () => ({
  type: LIST_PRODUCTS_START,
  isLoadingProducts: true,
});
export const listProductsReturn = (products) => ({
  type: LIST_PRODUCTS_RETURN,
  isLoadingProducts: false,
  products: products,
});
export function listProducts() {
  return function(dispatch) {
    dispatch(listProductsStart());

    return listProductsAPI().then(
      response => dispatch(listProductsReturn(response)),
      error => {
        Sentry.captureException(error);
        console.log(error);
      }
    )
  }
}

// students actions
export const getStudentStart = () => ({
  type: GET_STUDENT_START,
  isLoadingStudentFocus: true,
});
export const getStudentReturn = (student) => ({
  type: GET_STUDENT_RETURN,
  isLoadingStudentFocus: false,
  student: student
});
export function getStudent(userId) {
  return function(dispatch) {
    dispatch(getStudentStart());

    return getStudentAPI(userId).then(
      response => dispatch(getStudentReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateStudentStart = () => ({
  type: UPDATE_STUDENT_START,
  isLoadingUpdateStudent: true,
});
export const updateStudentReturn = (student) => ({
  type: UPDATE_STUDENT_RETURN,
  isLoadingUpdateStudent: false,
  student: student
});
export function updateStudent(studentId, updateData) {
  return function(dispatch) {
    dispatch(updateStudentStart());

    return updateStudentAPI(studentId, updateData).then(
      response => dispatch(updateStudentReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const listStudentsStart = () => ({
  type: LIST_STUDENTS_START,
  isLoadingStudents: true,
});
export const listStudentsReturn = (students) => ({
  type: LIST_STUDENTS_RETURN,
  isLoadingStudents: false,
  students: students,
});
export function listStudents(params) {
  return function(dispatch) {
    dispatch(listStudentsStart());

    return listStudentsAPI(params).then(
      response => dispatch(listStudentsReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

// teachers actions
export const getTeacherStart = () => ({
  type: GET_TEACHER_START,
  isLoadingTeacherFocus: true,
});
export const getTeacherReturn = (teacher) => ({
  type: GET_TEACHER_RETURN,
  isLoadingTeacherFocus: false,
  teacher: teacher
});
export function getTeacher(userId) {
  return function(dispatch) {
    dispatch(getTeacherStart());

    return getTeacherAPI().then(
      response => dispatch(getTeacherReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateTeacherStart = () => ({
  type: UPDATE_TEACHER_START,
  isLoadingUpdateTeacher: true,
});
export const updateTeacherReturn = (teacher) => ({
  type: UPDATE_TEACHER_RETURN,
  isLoadingUpdateTeacher: false,
  teacher: teacher
});
export function updateTeacher(teacherId, updateData) {
  return function(dispatch) {
    dispatch(updateTeacherStart());

    return updateTeacherAPI(teacherId, updateData).then(
      response => dispatch(updateTeacherReturn(response)),
      error => {
        Sentry.withScope(scope => {
          scope.setTags({
            "file": "src/redux/reducers/adminInfo.js",
            "function": "updateTeacherAPI",
          });
          Sentry.captureException(error);
        });
        dispatch(getErrorMessage(error.message || "API Internal Error"))
      }
    );
  };
}

export const listTeachersStart = () => ({
  type: LIST_TEACHERS_START,
  isLoadingTeachers: true,
});
export const listTeachersReturn = (teachers) => ({
  type: LIST_TEACHERS_RETURN,
  isLoadingTeachers: false,
  teachers: teachers,
});
export function listTeachers(params) {
  return function(dispatch) {
    dispatch(listTeachersStart());

    return listTeachersAPI(params).then(
      response => dispatch(listTeachersReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

// courses actions
export const getCourseStart = () => ({
  type: GET_COURSE_START,
  isLoadingCourseFocus: true,
});
export const getCourseReturn = (course) => ({
  type: GET_COURSE_RETURN,
  isLoadingCourseFocus: false,
  course: course
});
export function getCourse(courseId) {
  return function(dispatch) {
    dispatch(getCourseStart());

    return getCourseAPI(courseId).then(
      response => dispatch(getCourseReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateCourseStart = () => ({
  type: UPDATE_COURSE_START,
  isLoadingUpdateCourse: true,
});
export const updateCourseReturn = (course) => ({
  type: UPDATE_COURSE_RETURN,
  isLoadingUpdateCourse: false,
  course: course
});
export function updateCourse(courseId, updateData) {
  return function(dispatch) {
    dispatch(updateCourseStart());

    return updateCourseAPI(courseId, updateData).then(
      response => dispatch(updateCourseReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const listCoursesStart = () => ({
  type: LIST_COURSES_START,
  isLoadingCourses: true,
});
export const listCoursesReturn = (courses) => ({
  type: LIST_COURSES_RETURN,
  isLoadingCourses: false,
  courses: courses,
});
export function listCourses(params) {
  return function(dispatch) {
    dispatch(listCoursesStart());

    return listCoursesAPI(params).then(
      response => dispatch(listCoursesReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const deleteCourseStart = () => ({
  type: DELETE_COURSE_START,
  isLoadingCourses: true,
});
export const deleteCourseReturn = (response, courseId) => ({
  type: DELETE_COURSE_RETURN,
  isLoadingCourses: false,
  courseId: courseId,
  response: response,
});
export function deleteCourse(courseId) {
  return function(dispatch) {
    dispatch(deleteCourseStart());

    return deleteCourseAPI(courseId).then(
      response => dispatch(deleteCourseReturn(response, courseId)),
      error => {
        Sentry.withScope(scope => {
          scope.setTag("file", "src/redux/actions/adminInfo.js");
          scope.setTag("function", "deleteCourseAPI");
          Sentry.captureException(error);
        })
      }
    )
  }
}

// enrolments actions
export const createEnrolmentStart = () => ({
  type: CREATE_ENROLMENT_START,
  isLoadingEnrolments: true,
});
export const createEnrolmentReturn = (response) => ({
  type: CREATE_ENROLMENT_RETURN,
  isLoadingEnrolments: false,
  enrolment: response,
});
export function createEnrolment(enrolment, currency) {
  return function(dispatch) {
    dispatch(createEnrolmentStart());

    return createEnrolmentAPI(enrolment, currency).then(
      response => dispatch(createEnrolmentReturn(response)),
      error => {
        Sentry.captureException(error);
        console.log(error);
      }
    )
  }
}

export const getEnrolmentStart = () => ({
  type: GET_ENROLMENT_START,
  isLoadingEnrolmentFocus: true,
});
export const getEnrolmentReturn = (enrolment) => ({
  type: GET_ENROLMENT_RETURN,
  isLoadingEnrolmentFocus: false,
  enrolment: enrolment
});
export function getEnrolment(enrolmentId) {
  return function(dispatch) {
    dispatch(getEnrolmentStart());

    return getEnrolmentAPI(enrolmentId).then(
      response => dispatch(getEnrolmentReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateEnrolmentStart = () => ({
  type: UPDATE_ENROLMENT_START,
  isLoadingUpdateEnrolment: true,
});
export const updateEnrolmentReturn = (enrolment) => ({
  type: UPDATE_ENROLMENT_RETURN,
  isLoadingUpdateEnrolment: false,
  enrolment: enrolment
});
export function updateEnrolment(enrolmentId, updateData) {
  return function(dispatch) {
    dispatch(updateEnrolmentStart());

    return updateEnrolmentAPI(enrolmentId, updateData).then(
      response => dispatch(updateEnrolmentReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const listEnrolmentsStart = () => ({
  type: LIST_ENROLMENTS_START,
  isLoadingEnrolments: true,
});
export const listEnrolmentsReturn = (enrolments) => ({
  type: LIST_ENROLMENTS_RETURN,
  isLoadingEnrolments: false,
  enrolments: enrolments,
});
export function listEnrolments(params) {
  return function(dispatch) {
    dispatch(listEnrolmentsStart());

    return listEnrolmentsAPI(params).then(
      response => dispatch(listEnrolmentsReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

// lessons actions
export const getLessonStart = () => ({
  type: GET_LESSON_START,
  isLoadingLessonFocus: true,
});
export const getLessonReturn = (lesson) => ({
  type: GET_LESSON_RETURN,
  isLoadingLessonFocus: false,
  lesson: lesson
});
export function getLesson(lessonId) {
  return function(dispatch) {
    dispatch(getLessonStart());

    return getLessonAPI(lessonId).then(
      response => dispatch(getLessonReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const updateLessonStart = () => ({
  type: UPDATE_LESSON_START,
  isLoadingUpdateLesson: true,
});
export const updateLessonReturn = (lesson) => ({
  type: UPDATE_LESSON_RETURN,
  isLoadingUpdateLesson: false,
  lesson: lesson
});
export function updateLesson(lessonId, updateData) {
  return function(dispatch) {
    dispatch(updateLessonStart());

    return updateLessonAPI(lessonId, updateData).then(
      response => dispatch(updateLessonReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const listLessonsStart = () => ({
  type: LIST_LESSONS_START,
  isLoadingLessons: true,
});
export const listLessonsReturn = (lessons) => ({
  type: LIST_LESSONS_RETURN,
  isLoadingLessons: false,
  lessons: lessons,
});
export function listLessons(params) {
  return function(dispatch) {
    dispatch(listLessonsStart());

    return listLessonsAPI(params).then(
      response => dispatch(listLessonsReturn(response)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}