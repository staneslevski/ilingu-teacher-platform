import {
  // student actions
  GET_STUDENT_START,
  GET_STUDENT_RETURN,
  UPDATE_STUDENT_START,
  UPDATE_STUDENT_RETURN,
  LIST_STUDENTS_START,
  LIST_STUDENTS_RETURN,
  // teacher actions
  GET_TEACHER_START,
  GET_TEACHER_RETURN,
  UPDATE_TEACHER_START,
  UPDATE_TEACHER_RETURN,
  LIST_TEACHERS_START,
  LIST_TEACHERS_RETURN,
  // course actions
  GET_COURSE_START,
  GET_COURSE_RETURN,
  UPDATE_COURSE_START,
  UPDATE_COURSE_RETURN,
  LIST_COURSES_START,
  LIST_COURSES_RETURN,
  DELETE_COURSE_START,
  DELETE_COURSE_RETURN,
  // enrolment actions
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
  // products actions
  CREATE_PRODUCT_START,
  CREATE_PRODUCT_RETURN,
  LIST_PRODUCTS_START,
  LIST_PRODUCTS_RETURN,
  GET_PRODUCT_START,
  GET_PRODUCT_RETURN,
  UPDATE_PRODUCT_START,
  UPDATE_PRODUCT_RETURN,
} from "../action-types";

export default function adminInfoRedux(
  state = {
    courses: [],
    coursesById: {},
    courseFocus: {},
    enrolments: [],
    enrolmentsById: {},
    enrolmentFocus: {},
    lessons: [],
    lessonsById: {},
    lessonFocus: {},
    products: [],
    productsById: {},
    students: [],
    studentsById: {},
    studentFocus: {},
    teachers: [],
    teachersById: {},
    teacherFocus: {},
    isLoadingProducts: false,
    isLoadingStudentFocus: false,
    isLoadingUpdateStudent: false,
    isLoadingStudents: false,
    isLoadingCourseFocus: false,
    isLoadingUpdateCourse: false,
    isLoadingCourses: false,
    isLoadingEnrolmentFocus: false,
    isLoadingUpdateEnrolment: false,
    isLoadingEnrolments: false,
    isLoadingLessonFocus: false,
    isLoadingUpdateLesson: false,
    isLoadingLessons: false,
  },
  action
) {
    let enrolmentsById = {};
    let coursesById = {};
  switch (action.type) {
    case LIST_PRODUCTS_START:
      return Object.assign({}, state, {
        isLoadingProducts: action.isLoadingProducts
      });
    case LIST_PRODUCTS_RETURN:
      let productsById = {};
      action.products.Items.forEach(product => {
        productsById = {
          ...productsById,
          [product.productId]: product,
        }
      });
      return Object.assign({}, state, {
        isLoadingProducts: action.isLoadingProducts,
        productsById: productsById,
        products: action.products.Items,
      });
    case CREATE_PRODUCT_START:
      return Object.assign({}, state, {
        isLoadingProducts: action.isLoadingProducts,
      });
    case CREATE_PRODUCT_RETURN:
      return Object.assign({}, state, {
        isLoadingProducts: action.isLoadingProducts,
        products: [
          ...state.products,
          action.product,
        ],
        productsById: {
          ...state.productsById,
          [action.product.productId]: action.product,
        }
      });
    case GET_PRODUCT_START:
      console.log("action not yet supported");
      return null;
    case GET_PRODUCT_RETURN:
      console.log("action not yet supported");
      return null;
    case UPDATE_PRODUCT_START:
      console.log("action not yet supported");
      return null;
    case UPDATE_PRODUCT_RETURN:
      console.log("action not yet supported");
      return null;
    case GET_STUDENT_START:
      return Object.assign({}, state, {
        isLoadingStudentFocus: action.isLoadingStudentFocus,
      });
    case GET_STUDENT_RETURN:
      return Object.assign({}, state, {
        isLoadingStudentFocus: action.isLoadingStudentFocus,
        studentFocus: action.student,
      });
    case UPDATE_STUDENT_START:
      return Object.assign({}, state, {
        isLoadingUpdateStudent: action.isLoadingUpdateStudent,
      });
    case UPDATE_STUDENT_RETURN:
      return Object.assign({}, state, {
        isLoadingUpdateStudent: action.isLoadingUpdateStudent,
        studentFocus: action.student,
      });
    case LIST_STUDENTS_START:
      return Object.assign({}, state, {
        isLoadingStudents: action.isLoadingStudents,
      });
    case LIST_STUDENTS_RETURN:
      let studentsById = {};
      action.students.Items.forEach(student => {
        studentsById = {
          ...studentsById,
          [student.userId]: student,
        }
      });
      return Object.assign({}, state, {
        isLoadingStudents: action.isLoadingStudents,
        students: action.students.Items,
        studentsById: studentsById,
      });
        // teacher actions
    case GET_TEACHER_START:
      return Object.assign({}, state, {
        isLoadingTeacherFocus: action.isLoadingTeacherFocus,
      });
    case GET_TEACHER_RETURN:
      return Object.assign({}, state, {
        isLoadingTeacherFocus: action.isLoadingTeacherFocus,
        teacherFocus: action.teacher,
      });
    case UPDATE_TEACHER_START:
      return Object.assign({}, state, {
        isLoadingUpdateTeacher: action.isLoadingUpdateTeacher,
      });
    case UPDATE_TEACHER_RETURN:
      teachersById = {
      ...state.teachersById,
          [action.teacher.userId]: action.teacher,
      };
      let teachers = state.teachers.filter(teacher => teacher.userId !== action.teacher.userId);
      teachers.push(action.teacher);
      return Object.assign({}, state, {
        isLoadingUpdateTeacher: action.isLoadingUpdateTeacher,
        teachers: teachers,
        teachersById: teachersById,
      });
    case LIST_TEACHERS_START:
      return Object.assign({}, state, {
        isLoadingTeachers: action.isLoadingTeachers,
      });
    case LIST_TEACHERS_RETURN:
      let teachersById = {};
      action.teachers.Items.forEach(teacher => {
        teachersById = {
          ...teachersById,
          [teacher.userId]: teacher,
        }
      });
      return Object.assign({}, state, {
        isLoadingTeachers: action.isLoadingTeachers,
        teachers: action.teachers.Items,
        teachersById: teachersById,
      });
        // course actions
    case GET_COURSE_START:
      return Object.assign({}, state, {
        isLoadingCourseFocus: action.isLoadingCourseFocus,
      });
    case GET_COURSE_RETURN:
      return Object.assign({}, state, {
        isLoadingCourseFocus: action.isLoadingCourseFocus,
        courseFocus: action.course
      });
    case UPDATE_COURSE_START:
      return Object.assign({}, state, {
        isLoadingUpdateCourse: action.isLoadingUpdateCourse,
      });
    case UPDATE_COURSE_RETURN:
      return Object.assign({}, state, {
        isLoadingUpdateCourse: action.isLoadingUpdateCourse,
        courseFocus: action.course
      });
    case LIST_COURSES_START:
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses,
      });
    case LIST_COURSES_RETURN:
      action.courses.Items = action.courses.Items.map(course => {
        course.enrolments.forEach(enrolment => {
          enrolmentsById = {
            ...enrolmentsById,
            [enrolment.enrolmentId]: enrolment,
          }
        });
        return {
          ...course,
          enrolmentsById: enrolmentsById,
        }
      });
      coursesById = {};
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
    case DELETE_COURSE_START:
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses,
      });
    case DELETE_COURSE_RETURN:
      let courses = state.courses;
      coursesById = state.coursesById;
      if (state.coursesById.hasOwnProperty(action.courseId)) {
        delete coursesById[action.courseId];
        courses = courses.filter(course =>
          course.courseId !== action.courseId
        )
      }
      return Object.assign({}, state, {
        isLoadingCourses: action.isLoadingCourses,
        courses: courses,
        coursesById: coursesById,
      });
        // enrolment actions
    case CREATE_ENROLMENT_START:
      return Object.assign({}, state, {
        isLoadingEnrolments: action.isLoadingEnrolments,
      });
    case CREATE_ENROLMENT_RETURN:
      let {enrolments} = state;
      enrolmentsById = state.enrolmentsById;
      enrolmentsById[action.enrolment.enrolmentId] = action.enrolment;
      enrolments.push(action.enrolment);
      return Object.assign({}, state, {
        isLoadingEnrolments: action.isLoadingEnrolments,
        enrolments: enrolments,
        enrolmentsById: enrolmentsById,
      });
    case GET_ENROLMENT_START:
      return Object.assign({}, state, {
        isLoadingEnrolmentFocus: action.isLoadingEnrolmentFocus,
      });
    case GET_ENROLMENT_RETURN:
      return Object.assign({}, state, {
        isLoadingEnrolmentFocus: action.isLoadingEnrolmentFocus,
        enrolmentFocus: action.enrolment,
      });
    case UPDATE_ENROLMENT_START:
      return Object.assign({}, state, {
        isLoadingUpdateEnrolment: action.isLoadingUpdateEnrolment,
      });
    case UPDATE_ENROLMENT_RETURN:
      return Object.assign({}, state, {
        isLoadingUpdateEnrolment: action.isLoadingUpdateEnrolment,
        enrolmentFocus: action.enrolment,
      });
    case LIST_ENROLMENTS_START:
      return Object.assign({}, state, {
        isLoadingEnrolments: action.isLoadingEnrolments,
      });
    case LIST_ENROLMENTS_RETURN:
      action.enrolments.Items.forEach(enrolment => {
        enrolmentsById = {
          ...enrolmentsById,
          [enrolment.enrolmentId]: enrolment,
        }
      });
      return Object.assign({}, state, {
        isLoadingEnrolments: action.isLoadingEnrolments,
        enrolments: action.enrolments.Items,
        enrolmentsById: enrolmentsById,
      });
    // lesson actions
    case GET_LESSON_START:
      return Object.assign({}, state, {
        isLoadingLessonFocus: action.isLoadingLessonFocus,
      });
    case GET_LESSON_RETURN:
      return Object.assign({}, state, {
        isLoadingLessonFocus: action.isLoadingLessonFocus,
        lessonFocus: action.lesson,
      });
    case UPDATE_LESSON_START:
      return Object.assign({}, state, {
        isLoadingUpdateLesson: action.isLoadingUpdateLesson,
      });
    case UPDATE_LESSON_RETURN:
      return Object.assign({}, state, {
        isLoadingUpdateLesson: action.isLoadingUpdateLesson,
        lessonFocus: action.lesson,
      });
    case LIST_LESSONS_START:
      return Object.assign({}, state, {
        isLoadingLessons: action.isLoadingLessons,
      });
    case LIST_LESSONS_RETURN:
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
    default:
      return state;
  }
}
