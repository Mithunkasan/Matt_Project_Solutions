// export interface Project {
//   id: string;
//   name: string;
//   college: string;
//   department: string;
//   handler: string;
//   student: string;
//   date: string;
//   paymentProgress: number;
//   status: "pending" | "ongoing" | "completed";
//   team: string;
//   amountPaid?: number;
//   finalAmount?: number;
// }

// export interface ClassSchedule {
//   id: string;
//   project: string;
//   day: string;
//   location: string;
//   department: string;
//   time: string;
//   faculty: string;
//   date?: string;
// }

// export interface StatsCard {
//   title: string;
//   value: string;
//   subtitle: string;
//   footer: string;
// }







export interface Project {
  id: string
  name: string
  college: string
  department: string
  handler: string
  team: string
  student: string
  studentEmail?: string
  date: string
  amountPaid: number
  finalAmount: number
  paymentProgress: number
  status: 'pending' | 'ongoing' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export interface ClassSchedule {
  id: string
  project: string
  day: string
  date: string
  time: string
  faculty: string
  studentEmail?: string
  location: string
  department: string
  createdAt?: string
  updatedAt?: string
}

