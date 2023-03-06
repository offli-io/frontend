import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface IEditActivity {
  title: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  isPrivate: boolean;
  maxAttendance: number;
  price: string;
  additionalDesc: string;
}

export const schema: () => yup.SchemaOf<IEditActivity> = () =>
  yup.object({
    title: yup.string().defined().required("Please enter the Title"),
    location: yup.string().defined().required("Please enter the Location"),
    startDateTime: yup.date().defined().required("Please enter the Start Date"),
    endDateTime: yup.date().defined().required("Please enter the End Date"),
    isPrivate: yup.boolean().defined(),
    maxAttendance: yup
      .number()
      .defined()
      .required("Please enter How many people can attend"),
    price: yup.string().defined().required("Please enter the Price"),
    additionalDesc: yup
      .string()
      .defined()
      .required("Please enter the Description"),
    // about_me: yup.string().defined().required("Please enter your aboutMe"),
    // location: yup.string().defined().required("Please enter your location"),
    // birthdate: yup.date().nullable().required("Please enter your birthDate"),
    // instagram: yup
    //   .string()
    //   .defined()
    //   .required("Please enter your instagramUsername"),
  });
