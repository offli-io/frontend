export interface IUpdateActivityRequestDto {
    title: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    isPrivate: boolean;
    maxAttendance: number;
    price: string;
    additionalDesc: string;
  }