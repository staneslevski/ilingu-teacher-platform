import {
  REQUEST_COURSES,
  RECEIVE_COURSES,
  REQUEST_ENROLMENTS,
  RECEIVE_ENROLMENTS,
  ADDING_TRIAL_QUESTIONNAIRE,
  ADDED_TRIAL_QUESTIONNAIRE,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  REQUEST_TEACHERS,
  RECEIVE_TEACHERS,
  CREATING_COURSE,
  CREATED_COURSE,
  CREATING_ENROLMENT,
  CREATED_ENROLMENT,
  CREATING_LESSON,
  CREATED_LESSON,
  REQUEST_TEACHER_LESSONS,
  RECEIVE_TEACHER_LESSONS,
  REQUEST_TEACHER_AVAILABILITIES,
  RECEIVE_TEACHER_AVAILABILITIES
} from "../action-types";
import { getErrorMessage } from "./messageInfo";

import {
  listEnrolmentsByStudentId,
  addTrialQuestionnaire as addTrialQuestionnaireAPI,
  createEnrolment as createEnrolmentAPI
} from "../../libs/ilingu-libs/enrolment";
import {
  listCoursesByStudentId,
  createCourse as createCourseAPI
} from "../../libs/ilingu-libs/course";
import { listProducts } from "../../libs/ilingu-libs/product";
import {
  getTeacherAvailabilities,
  listTeachers
} from "../../libs/ilingu-libs/teacher";
import {
  createLesson as createLessonAPI,
  listLessonsByTeacherId
} from "../../libs/ilingu-libs/lesson";
import config from "../../config";
import moment from "moment";

const _ = require("lodash");

export const requestCourses = () => ({
  type: REQUEST_COURSES,
  isLoadingCourses: true
});

export const receiveCourses = courses => ({
  type: RECEIVE_COURSES,
  courses: courses,
  isLoadingCourses: false
});

export function fetchCourses(userId) {
  return function(dispatch) {
    dispatch(requestCourses());

    return listCoursesByStudentId(userId).then(
      courses => dispatch(receiveCourses(courses)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestEnrolments = () => ({
  type: REQUEST_ENROLMENTS,
  isLoadingEnrolments: true
});

export const receiveEnrolments = enrolments => ({
  type: RECEIVE_ENROLMENTS,
  enrolments: enrolments,
  enrolmentMappingByCourseId: _.groupBy(enrolments, "courseId"),
  isLoadingEnrolments: false
});

export function fetchEnrolments(userId) {
  return function(dispatch) {
    dispatch(requestEnrolments());

    return listEnrolmentsByStudentId(userId).then(
      enrolments => dispatch(receiveEnrolments(enrolments)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const addingTrialQuestionnaire = () => ({
  type: ADDING_TRIAL_QUESTIONNAIRE,
  isAddingTrialQuestionnaire: true
});

export const addedTrialQuestionnaire = () => ({
  type: ADDED_TRIAL_QUESTIONNAIRE,
  isAddingTrialQuestionnaire: false,
  isAddedTrialQuestionnaire: true
});

export function addTrialQuestionnaire(params) {
  return function(dispatch) {
    dispatch(addingTrialQuestionnaire());

    return addTrialQuestionnaireAPI(params).then(
      () => dispatch(addedTrialQuestionnaire()),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestProducts = () => ({
  type: REQUEST_PRODUCTS,
  isLoadingProducts: true
});

export const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products: products,
  productMappingByProductId: _.keyBy(products, "productId"),
  isLoadingProducts: false
});

export function fetchProducts() {
  return function(dispatch) {
    dispatch(requestProducts());

    return listProducts().then(
      products => dispatch(receiveProducts(products)),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestTeachers = () => ({
  type: REQUEST_TEACHERS,
  isLoadingTeachers: true
});

export const receiveTeachers = teachers => ({
  type: RECEIVE_TEACHERS,
  teachers: teachers,
  teacherMappingByUserId: _.keyBy(teachers, "userId"),
  isLoadingTeachers: false
});

export function fetchTeachers() {
  return function(dispatch) {
    dispatch(requestTeachers());

    return listTeachers(config.PAGE_SIZE).then(
      teachers => dispatch(receiveTeachers(teachers.Items)), //TODO: pagination
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const creatingCourse = () => ({
  type: CREATING_COURSE,
  isCreatingCourse: true
});

export const createdCourse = course => ({
  type: CREATED_COURSE,
  isCreatingCourse: false,
  selectedCourse: course
});

export function createCourse(params) {
  return function(dispatch) {
    dispatch(creatingCourse());

    return createCourseAPI(params).then(
      course => {
        dispatch(createdCourse(course));
        return course;
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const creatingEnrolment = () => ({
  type: CREATING_ENROLMENT,
  isCreatingEnrolment: true
});

export const createdEnrolment = enrolment => ({
  type: CREATED_ENROLMENT,
  isCreatingEnrolment: false,
  selectedEnrolment: enrolment
});

export function createEnrolment(params) {
  return function(dispatch) {
    dispatch(creatingEnrolment());

    return createEnrolmentAPI(params).then(
      enrolment => {
        dispatch(createdEnrolment(enrolment));
        return enrolment;
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const creatingLesson = () => ({
  type: CREATING_LESSON,
  isCreatingLesson: true
});

export const createdLesson = () => ({
  type: CREATED_LESSON,
  isCreatingLesson: false
});

export function createLesson(params) {
  return function(dispatch) {
    dispatch(creatingLesson());

    return createLessonAPI(params).then(
      () => dispatch(createdLesson()),
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestTeacherLessons = () => ({
  type: REQUEST_TEACHER_LESSONS,
  isLoadingTeacherLessons: true
});

export const receiveTeacherLessons = (userId, start, end, teacherLessons) => ({
  type: RECEIVE_TEACHER_LESSONS,
  userIdStartEnd: `${userId}${start}${end}`,
  teacherLessons: teacherLessons,
  isLoadingTeacherLessons: false
});

export function fetchTeacherLessons(userId, start, end) {
  return function(dispatch) {
    dispatch(requestTeacherLessons());

    return listLessonsByTeacherId(userId, start, end).then(
      teacherLessons => {
        let lessons = _.map(teacherLessons, "parts");
        lessons = _.flatten(lessons);
        lessons = lessons.map(l => ({
          start: l.startDateTime,
          end: l.endDateTime,
          rendering: "background"
        }));
        return dispatch(receiveTeacherLessons(userId, start, end, lessons));
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}

export const requestTeacherAvailabilities = () => ({
  type: REQUEST_TEACHER_AVAILABILITIES,
  isLoadingTeacherAvailabilities: true
});

export const receiveTeacherAvailabilities = (
  userId,
  teacherAvailabilities
) => ({
  type: RECEIVE_TEACHER_AVAILABILITIES,
  userId: userId,
  teacherAvailabilities: teacherAvailabilities,
  isLoadingTeacherAvailabilities: false
});

export function fetchTeacherAvailabilities(userId) {
  return function(dispatch) {
    dispatch(requestTeacherAvailabilities());

    return getTeacherAvailabilities(userId).then(
      slots => {
        let teacherAvailabilities = [];
        let start, end;
        slots.map(slot => {
          start = moment(slot.start, "dddd HH:mm");
          end = moment(slot.end, "dddd HH:mm");
          teacherAvailabilities.push({
            dow: [start.weekday()],
            start: start.format("HH:mm"),
            end: end.format("HH:mm")
          });
        });
        return dispatch(
          receiveTeacherAvailabilities(userId, teacherAvailabilities)
        );
      },
      error => dispatch(getErrorMessage(error.message || "API Internal Error"))
    );
  };
}
