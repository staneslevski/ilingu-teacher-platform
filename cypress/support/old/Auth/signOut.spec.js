import studentUserData from "../../../fixtures/student/studentUserData";

import { logIn } from "../../TestAsAFunction/Auth/login";
import { signOut } from "../../TestAsAFunction/Auth/signOut";


logIn(studentUserData);
signOut();
// logIn(teacherUserData);
// logIn(adminUserData);
