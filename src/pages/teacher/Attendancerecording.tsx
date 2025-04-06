import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, addMonths, subMonths } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Type definitions
interface Teacher {
  id: string;
  name: string;
  email: string;
  school_id: string;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  teacher_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
}

// UI Components
const Button: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  disabled = false
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-secondary active:bg-secondary",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  };
  
  const sizeStyles = {
    sm: "h-8 px-3 rounded-md text-sm",
    md: "h-10 px-4 py-2 rounded-md",
    lg: "h-12 px-6 rounded-md text-lg",
    icon: "h-10 w-10 rounded-md"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input: React.FC<{
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({ placeholder, type = "text", value, onChange, icon, className = "" }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md py-2 ${
          icon ? "pl-10" : "pl-4"
        } pr-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

const Tabs: React.FC<{
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex -mb-px space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const StatusBadge: React.FC<{
  status: AttendanceRecord["status"];
}> = ({ status }) => {
  const styles = {
    present: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    absent: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    excused: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main TeacherAttendance Component
const TeacherAttendance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? fr : enUS;
  
  const [activeTab, setActiveTab] = useState<string>("daily");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mock data
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: "1", name: "Marie Dupont", email: "marie.dupont@school.com", school_id: "1", created_at: "2023-01-01T09:00:00Z" },
    { id: "2", name: "Jean Martin", email: "jean.martin@school.com", school_id: "1", created_at: "2023-01-02T09:00:00Z" },
    { id: "3", name: "Sophie Bernard", email: "sophie.bernard@school.com", school_id: "1", created_at: "2023-01-03T09:00:00Z" },
    { id: "4", name: "Lucas Petit", email: "lucas.petit@school.com", school_id: "1", created_at: "2023-01-04T09:00:00Z" },
    { id: "5", name: "Emma Leroy", email: "emma.leroy@school.com", school_id: "1", created_at: "2023-01-05T09:00:00Z" }
  ]);
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: "1", teacher_id: "1", date: "2025-04-05", status: "present", check_in_time: "08:30", check_out_time: "16:30" },
    { id: "2", teacher_id: "2", date: "2025-04-05", status: "late", check_in_time: "09:15", check_out_time: "16:30", notes: "Traffic delay" },
    { id: "3", teacher_id: "3", date: "2025-04-05", status: "absent", notes: "Sick leave" },
    { id: "4", teacher_id: "4", date: "2025-04-05", status: "present", check_in_time: "08:15", check_out_time: "16:00" },
    { id: "5", teacher_id: "5", date: "2025-04-05", status: "excused", notes: "Professional development day" }
  ]);
  
  const tabs = [
    { id: "daily", label: t("attendance.daily") || "Daily View" },
    { id: "monthly", label: t("attendance.monthly") || "Monthly View" },
    { id: "records", label: t("attendance.records") || "Records" }
  ];

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get attendance for a specific teacher on the selected date
  const getTeacherAttendance = (teacherId: string) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return attendanceRecords.find(record => 
      record.teacher_id === teacherId && record.date === formattedDate
    );
  };

  // Update attendance status
  const updateAttendanceStatus = (teacherId: string, status: AttendanceRecord["status"]) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const existingRecordIndex = attendanceRecords.findIndex(record => 
      record.teacher_id === teacherId && record.date === formattedDate
    );

    if (existingRecordIndex >= 0) {
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status
      };
      setAttendanceRecords(updatedRecords);
    } else {
      setAttendanceRecords([
        ...attendanceRecords,
        {
          id: `new-${Date.now()}`,
          teacher_id: teacherId,
          date: formattedDate,
          status
        }
      ]);
    }
  };

  // Date navigation in monthly view
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Generate calendar days for monthly view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get teacher's attendance percentage for current month
  const getMonthlyAttendancePercentage = (teacherId: string) => {
    const monthDays = calendarDays.filter(day => !isWeekend(day)).length;
    const teacherAttendance = attendanceRecords.filter(record => 
      record.teacher_id === teacherId && 
      record.date.startsWith(format(currentDate, "yyyy-MM")) &&
      (record.status === "present" || record.status === "late")
    );
    
    return monthDays > 0 ? (teacherAttendance.length / monthDays) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("attendance.teacherAttendance") || "Teacher Attendance"}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t("common.filter") || "Filter"}
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            {format(selectedDate, "PPP", { locale })}
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mb-4">
        <Input
          placeholder={t("common.searchTeachers") || "Search teachers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {activeTab === "daily" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("teacher.name") || "Name"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("teacher.email") || "Email"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("attendance.status") || "Status"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("attendance.checkIn") || "Check In"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("attendance.checkOut") || "Check Out"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("attendance.actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeachers.map((teacher) => {
                  const attendance = getTeacherAttendance(teacher.id);
                  return (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {attendance ? (
                          <StatusBadge status={attendance.status} />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {attendance?.check_in_time || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {attendance?.check_out_time || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant={attendance?.status === "present" ? "primary" : "outline"} 
                            size="sm"
                            onClick={() => updateAttendanceStatus(teacher.id, "present")}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {t("attendance.present") || "Present"}
                          </Button>
                          <Button 
                            variant={attendance?.status === "absent" ? "destructive" : "outline"} 
                            size="sm"
                            onClick={() => updateAttendanceStatus(teacher.id, "absent")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {t("attendance.absent") || "Absent"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "monthly" && (
        <div className="space-y-6">
          <Card className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {format(currentDate, "MMMM yyyy", { locale })}
              </h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                        {t("teacher.name") || "Name"}
                      </th>
                      {calendarDays.map((day) => (
                        <th 
                          key={format(day, "yyyy-MM-dd")}
                          className={`px-1 py-2 text-center text-xs font-medium 
                            ${isWeekend(day) ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-300"}
                            ${isToday(day) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        >
                          <div>{format(day, "d")}</div>
                          <div className="text-xs">{format(day, "EEEEE", { locale })}</div>
                        </th>
                      ))}
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {teacher.name}
                        </td>
                        {calendarDays.map((day) => {
                          const formattedDate = format(day, "yyyy-MM-dd");
                          const attendance = attendanceRecords.find(record => 
                            record.teacher_id === teacher.id && record.date === formattedDate
                          );
                          
                          const getStatusColor = () => {
                            if (isWeekend(day)) return "bg-gray-100 dark:bg-gray-700";
                            if (!attendance) return "";
                            switch (attendance.status) {
                              case "present": return "bg-green-100 dark:bg-green-900/20";
                              case "absent": return "bg-red-100 dark:bg-red-900/20";
                              case "late": return "bg-yellow-100 dark:bg-yellow-900/20";
                              case "excused": return "bg-blue-100 dark:bg-blue-900/20";
                              default: return "";
                            }
                          };
                          
                          const getStatusText = () => {
                            if (!attendance) return "";
                            switch (attendance.status) {
                              case "present": return "P";
                              case "absent": return "A";
                              case "late": return "L";
                              case "excused": return "E";
                              default: return "";
                            }
                          };
                          
                          return (
                            <td 
                              key={formattedDate}
                              className={`px-1 py-3 text-center text-xs ${getStatusColor()} ${
                                isToday(day) ? "border border-blue-300 dark:border-blue-600" : ""
                              }`}
                            >
                              {getStatusText()}
                            </td>
                          );
                        })}
                        <td className="px-2 py-3 text-center text-sm font-medium">
                          {Math.round(getMonthlyAttendancePercentage(teacher.id))}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title={t("attendance.legend") || "Legend"}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 mr-2 rounded"></div>
                  <span>{t("attendance.present") || "Present"} (P)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 mr-2 rounded"></div>
                  <span>{t("attendance.absent") || "Absent"} (A)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 mr-2 rounded"></div>
                  <span>{t("attendance.late") || "Late"} (L)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 mr-2 rounded"></div>
                  <span>{t("attendance.excused") || "Excused"} (E)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 mr-2 rounded"></div>
                  <span>{t("attendance.weekend") || "Weekend"}</span>
                </div>
              </div>
            </Card>
            
            <Card title={t("attendance.summary") || "Summary"}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("attendance.totalTeachers") || "Total Teachers"}:</span>
                  <span className="font-medium">{teachers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("attendance.averageAttendance") || "Average Attendance"}:</span>
                  <span className="font-medium">
                    {Math.round(
                      teachers.reduce((acc, teacher) => acc + getMonthlyAttendancePercentage(teacher.id), 0) / teachers.length
                    )}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("attendance.workingDays") || "Working Days"}:</span>
                  <span className="font-medium">
                    {calendarDays.filter(day => !isWeekend(day)).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "records" && (
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  placeholder={t("attendance.searchRecords") || "Search records..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <div>
                <Button className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  {t("attendance.exportRecords") || "Export Records"}
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("teacher.name") || "Name"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("attendance.date") || "Date"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("attendance.status") || "Status"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("attendance.checkIn") || "Check In"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("attendance.checkOut") || "Check Out"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("attendance.notes") || "Notes"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {attendanceRecords
                    .filter(record => {
                      const teacher = teachers.find(t => t.id === record.teacher_id);
                      return teacher && (
                        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        record.notes?.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                    })
                    .map((record) => {
                      const teacher = teachers.find(t => t.id === record.teacher_id);
                      return (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {teacher?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(record.date).toLocaleDateString(i18n.language, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <StatusBadge status={record.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {record.check_in_time || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {record.check_out_time || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {record.notes || "-"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherAttendance;