export type FacilityPhoto = {
  src: string;
  alt: string;
  tag: string;
  title: string;
  className: string;
};

export const FACILITY_PHOTOS: FacilityPhoto[] = [
  {
    src: "/ganga_dental_care_outer_view.jpeg",
    alt: "Ganga Dental Care clinic exterior",
    className: "min-h-[280px] md:min-h-0 md:row-span-2",
    tag: "Ganga Dental Clinic",
    title: "Our Clinic Exterior",
  },
  {
    src: "/ganga_Dental_Care_reception_Desk.jpeg",
    alt: "Ganga Dental Care reception desk",
    className: "min-h-[220px] md:min-h-0",
    tag: "Welcome",
    title: "Reception Desk",
  },
  {
    src: "/ganga_Dental_Care_main_Desk_with_doctor_sitting.jpeg",
    alt: "Doctor at Ganga Dental Care main desk",
    className: "min-h-[220px] md:min-h-0",
    tag: "Expert Care",
    title: "Meet Our Dental Team",
  },
];
