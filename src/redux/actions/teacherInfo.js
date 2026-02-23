import {
  GET_TEACHER_START,
  GET_TEACHER_RETURN,
  GET_STUDENT_START,
  GET_STUDENT_RETURN,
  LIST_LESSONS_BY_TEACHER_ID_START,
  LIST_LESSONS_BY_TEACHER_ID_RETURN,
  LIST_COURSES_BY_TEACHER_ID_START,
  LIST_COURSES_BY_TEACHER_ID_RETURN,
} from "../action-types";

import { getErrorMessage } from "./messageInfo";

import {
  getTeacherAPI
} from "../../libs/ilingu-libs/Teachers/CRUD/get";

import {
  getStudentAPI
} from "../../libs/ilingu-libs/Students/CRUD/get";

import {
  listLessonsByTeacherIdAPI
} from "../../libs/ilingu-libs/Lessons/Helpers/listLessonsByTeacherId";

import {
  listCoursesByTeacherIdAPI
} from "../../libs/ilingu-libs/Courses/Helpers/listCoursesByTeacherId";

import * as Sentry from "@sentry/browser";
import config from "../../config";

Sentry.init(config.sentry);

export const getTeacherStart = () => ({
  type: GET_TEACHER_START,
  isLoadingTeachers: true
});
export const getTeacherReturn = (response) => ({
  type: GET_TEACHER_RETURN,
  isLoadingTeachers: false,
  teacher: response,
});
export function getTeacher(teacherId) {
  return function(dispatch) {
    dispatch(getTeacherStart());

    return getTeacherAPI(teacherId).then(
      response => dispatch(getTeacherReturn(response)),
      error => {
        Sentry.captureException(error);
        dispatch(getErrorMessage(error.message || "API ERROR"))
      }
    )
  }
}

export const getStudentStart = () => ({
  type: GET_STUDENT_START,
  isLoadingStudents: true,
});
export const getStudentReturn = (response) => ({
  type: GET_STUDENT_RETURN,
  isLoadingStudents: false,
  student: response,
});
export function getStudent(studentId) {
  return function(dispatch) {
    dispatch(getStudentStart());

    return getStudentAPI(studentId).then(
      response => dispatch(getStudentReturn(response)),
      error => {
        Sentry.captureException(error);
        dispatch(getErrorMessage(error.message || "API ERROR"))
      }
    )
  }
}

export const listLessonsByTeacherIdStart = () => ({
  type: LIST_LESSONS_BY_TEACHER_ID_START,
  isLoadingLessons: true
});
export const listLessonsByTeacherIdReturn = (response) => ({
  type: LIST_LESSONS_BY_TEACHER_ID_RETURN,
  isLoadingLessons: false,
  lessons: response,
});
export function listLessonsByTeacherId(teacherId) {
  return function(dispatch) {
    dispatch(listLessonsByTeacherIdStart());

    return listLessonsByTeacherIdAPI(teacherId).then(
    response => dispatch(listLessonsByTeacherIdReturn(response)),
    error => {
      Sentry.captureException(error);
      dispatch(getErrorMessage(error.message || "API Internal Error"))
      }
    )
  }
}

export const listCoursesByTeacherIdStart = () => ({
  type: LIST_COURSES_BY_TEACHER_ID_START,
  isLoadingCourses: true,
});
export const listCoursesByTeacherIdReturn = (response) => ({
  type: LIST_COURSES_BY_TEACHER_ID_RETURN,
  isLoadingCourses: false,
  courses: response
});
export function listCoursesByTeacherId(teacherId) {
  return function(dispatch) {
    dispatch(listCoursesByTeacherIdStart());

    return listCoursesByTeacherIdAPI(teacherId).then(
      response => dispatch(listCoursesByTeacherIdReturn(response)),
      error => {
        Sentry.captureException(error);
        dispatch(getErrorMessage(error.message || "API ERROR"))
      }
    )
  }
}