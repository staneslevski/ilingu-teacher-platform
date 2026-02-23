import {
  REQUEST_ADDRESSES,
  RECEIVE_ADDRESSES,
  CHANGING_DEFAULT_ADDRESSES,
  CHANGED_DEFAULT_ADDRESSES,
  ADDING_ADDRESS,
  ADDED_ADDRESS,
  GET_STUDENT_START,
  GET_STUDENT_RETURN,
  GET_TEACHER_START,
  GET_TEACHER_RETURN,
  LIST_COURSES_BY_TEACHER_ID_START,
  LIST_COURSES_BY_TEACHER_ID_RETURN,
  LIST_LESSONS_BY_TEACHER_ID_START,
  LIST_LESSONS_BY_TEACHER_ID_RETURN,
} from "../action-types";

export default function getTeacherInfo(
  state = {
    students: [],
    studentsById: {},
    courses: [],
    coursesById: {},
    lessons: [],
    lessonsById: {},
    isLoadingStudents: false,
    isLoadingCourses: false,
    isLoadingLessons: false,
  },
  action
) {
  switch (action.type) {
    case GET_TEACHER_START:
      return Object.assign({}, state, {
        isLoadingTeachers: action.isLoadingTeachers,
      });
    case GET_TEACHER_RETURN:
      let teachersById = {
          ...state.teachersById,
          [action.teacher.userId]: action.teacher,
        };
      let teacherKeys = Object.keys(teachersById);
      let teachers = teacherKeys.map(key => {
        return teachersById[key]
      });
      return Object.assign({}, state, {
        teachersById: teachersById,
        teachers: teachers,
        isLoadingTeachers: action.isLoadingTeachers,
      });
    case GET_STUDENT_START:
      return Object.assign({}, state, {
        isLoadingStudents: action.isLoadingStudent,
      });
    case GET_STUDENT_RETURN:
      let studentsById = {
        ...state.studentsById,
        [action.student.userId]: action.student,
      };
      let studentKeys = Object.keys(action.student);
      let students = studentKeys.map(key => {
        return studentsById[key]
      });
      return Object.assign({}, state, {
        isLoadingStudents: action.isLoadingStudent,
        students: students,
        studentsById: studentsById,
      });
    case LIST_COURSES_BY_TEACHER_ID_START:
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses,
      });
    case LIST_COURSES_BY_TEACHER_ID_RETURN:
      let coursesById = {};
      action.courses.Items.forEach(course => {
        coursesById = {
          ...coursesById,
          [course.courseId]: course,
        }
      });
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses,
        courses: action.courses.Items,
        coursesById: coursesById,
      });
    case LIST_LESSONS_BY_TEACHER_ID_START:
      return Object.assign({}, state, {
        isLoadingLessons: action.isLoadingLessons,
      });
    case LIST_LESSONS_BY_TEACHER_ID_RETURN:
      let lessonsById = {};
      action.lessons.Items.forEach(lesson => {
        lessonsById = {
          ...lessonsById,
          [lesson.lessonId]: lesson,
        }
      });
      return Object.assign({}, state, {
        isLoadingLessons: action.isLoadingLessons,
        lessons: action.lessons.Items,
        lessonsById: lessonsById,
      });
    case REQUEST_ADDRESSES:
      return Object.assign({}, state, {
        isLoadingAddresses: action.isLoadingAddresses
      });
    case RECEIVE_ADDRESSES:
      return Object.assign({}, state, {
        addresses: action.addresses,
        isLoadingAddresses: action.isLoadingAddresses
      });
    case CHANGING_DEFAULT_ADDRESSES:
      return Object.assign({}, state, {
        changingToDefaultAddressId: action.changingToDefaultAddressId
      });
    case CHANGED_DEFAULT_ADDRESSES:
      return Object.assign({}, state, {
        changingToDefaultAddressId: undefined
      });
    case ADDING_ADDRESS:
    case ADDED_ADDRESS:
      return Object.assign({}, state, {
        isAddingAddress: action.isAddingAddress
      });
    default:
      return state;
  }
}
