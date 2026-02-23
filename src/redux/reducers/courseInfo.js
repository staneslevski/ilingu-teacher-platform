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

export default function getCourseInfo(
  state = {
    isLoadingCourses: false,
    courses: [],
    isLoadingEnrolments: false,
    enrolments: [],
    enrolmentMappingByCourseId: {},
    isAddingTrialQuestionnaire: false,
    isAddedTrialQuestionnaire: false,
    isLoadingProducts: false,
    products: [],
    productMappingByProductId: {},
    isLoadingTeachers: false,
    teachers: [],
    teacherMappingByUserId: {},
    isCreatingCourse: false,
    selectedCourse: undefined,
    isCreatingEnrolment: false,
    selectedEnrolment: undefined,
    isCreatingLesson: false,
    isLoadingTeacherLessons: false,
    teacherLessons: {},
    isLoadingTeacherAvailabilities: false,
    teacherAvailabilities: {}
  },
  action
) {
  switch (action.type) {
    case REQUEST_COURSES:
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses
      });
    case RECEIVE_COURSES:
      return Object.assign({}, state, {
        courses: action.courses,
        isLoadingCourses: action.isLoadingCourses
      });
    case REQUEST_ENROLMENTS:
      return Object.assign({}, state, {
        isLoadingEnrolments: action.isLoadingEnrolments
      });
    case RECEIVE_ENROLMENTS:
      return Object.assign({}, state, {
        enrolments: action.enrolments,
        enrolmentMappingByCourseId: action.enrolmentMappingByCourseId,
        isLoadingEnrolments: action.isLoadingEnrolments
      });
    case ADDING_TRIAL_QUESTIONNAIRE:
      return Object.assign({}, state, {
        isAddingTrialQuestionnaire: action.isAddingTrialQuestionnaire
      });
    case ADDED_TRIAL_QUESTIONNAIRE:
      return Object.assign({}, state, {
        isAddingTrialQuestionnaire: action.isAddingTrialQuestionnaire,
        isAddedTrialQuestionnaire: action.isAddedTrialQuestionnaire
      });
    case REQUEST_PRODUCTS:
      return Object.assign({}, state, {
        isLoadingProducts: action.isLoadingProducts
      });
    case RECEIVE_PRODUCTS:
      return Object.assign({}, state, {
        products: action.products,
        productMappingByProductId: action.productMappingByProductId,
        isLoadingProducts: action.isLoadingProducts
      });
    case REQUEST_TEACHERS:
      return Object.assign({}, state, {
        isLoadingTeachers: action.isLoadingTeachers
      });
    case RECEIVE_TEACHERS:
      return Object.assign({}, state, {
        teachers: action.teachers,
        teacherMappingByUserId: action.teacherMappingByUserId,
        isLoadingTeachers: action.isLoadingTeachers
      });
    case CREATING_COURSE:
      return Object.assign({}, state, {
        isCreatingCourse: action.isCreatingCourse
      });
    case CREATED_COURSE:
      return Object.assign({}, state, {
        isCreatingCourse: action.isCreatingCourse,
        selectedCourse: action.course
      });
    case CREATING_ENROLMENT:
      return Object.assign({}, state, {
        isCreatingEnrolment: action.isCreatingEnrolment
      });
    case CREATED_ENROLMENT:
      return Object.assign({}, state, {
        isCreatingEnrolment: action.isCreatingEnrolment,
        selectedEnrolment: action.selectedEnrolment
      });
    case CREATING_LESSON:
      return Object.assign({}, state, {
        isCreatingLesson: action.isCreatingLesson
      });
    case CREATED_LESSON:
      return Object.assign({}, state, {
        isCreatingLesson: action.isCreatingLesson
      });
    case REQUEST_TEACHER_LESSONS:
      return Object.assign({}, state, {
        isLoadingTeacherLessons: action.isLoadingTeacherLessons
      });
    case RECEIVE_TEACHER_LESSONS:
      return Object.assign({}, state, {
        teacherLessons: Object.assign({}, state.teacherLessons, {
          [action.userIdStartEnd]: action.teacherLessons
        }),
        isLoadingTeacherLessons: action.isLoadingTeacherLessons
      });
    case REQUEST_TEACHER_AVAILABILITIES:
      return Object.assign({}, state, {
        isLoadingTeacherAvailabilities: action.isLoadingTeacherAvailabilities
      });
    case RECEIVE_TEACHER_AVAILABILITIES:
      return Object.assign({}, state, {
        teacherAvailabilities: Object.assign({}, state.teacherAvailabilities, {
          [action.userId]: action.teacherAvailabilities
        }),
        isLoadingTeacherAvailabilities: action.isLoadingTeacherAvailabilities
      });
    default:
      return state;
  }
}
