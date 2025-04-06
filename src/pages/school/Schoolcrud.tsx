import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Plus, Search, MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/components";
import { Select } from "../../components/ui/components";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/components";
import { Badge } from "../../components/ui/components";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdownmenu";

// School type definition based on schema
interface School {
  id: string;
  name: string;
  domain: string;
  plan: string;
  start_date: string;
  end_date: string;
  timezone: string;
  locale: string;
  branding_colors: {
    primary?: string;
    secondary?: string;
  };
  status: 'active' | 'suspended' | 'trial';
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
}

// Mock data
const mockSchools: School[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Stanford University",
    domain: "stanford.edu",
    plan: "Enterprise",
    start_date: "2023-01-01",
    end_date: "2024-12-31",
    timezone: "America/Los_Angeles",
    locale: "en-US",
    branding_colors: {
      primary: "#8C1515",
      secondary: "#4D4F53"
    },
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    settings: { allow_self_registration: true }
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    name: "MIT",
    domain: "mit.edu",
    plan: "Premium",
    start_date: "2023-02-15",
    end_date: "2024-02-14",
    timezone: "America/New_York",
    locale: "en-US",
    branding_colors: {
      primary: "#A31F34",
      secondary: "#8A8B8C"
    },
    status: "active",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
    settings: { allow_self_registration: true }
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    name: "École Polytechnique",
    domain: "polytechnique.edu",
    plan: "Basic",
    start_date: "2023-03-01",
    end_date: "2023-12-31",
    timezone: "Europe/Paris",
    locale: "fr-FR",
    branding_colors: {
      primary: "#3ca377", 
      secondary: "#2c7a59"
    },
    status: "trial",
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
    settings: { allow_self_registration: false }
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    name: "University of Tokyo",
    domain: "u-tokyo.ac.jp",
    plan: "Standard",
    start_date: "2023-04-01",
    end_date: "2024-03-31",
    timezone: "Asia/Tokyo",
    locale: "ja-JP",
    branding_colors: {
      primary: "#0F2350",
      secondary: "#00A4E4"
    },
    status: "suspended",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2023-04-01T00:00:00Z",
    settings: { allow_self_registration: false }
  }
];

// Status badge color mapping
const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  trial: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
};

const SchoolManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [newSchool, setNewSchool] = useState<Partial<School>>({
    name: "",
    domain: "",
    plan: "Basic",
    status: "trial",
    timezone: "UTC",
    locale: "en-US",
    branding_colors: {
      primary: "#3ca377",
      secondary: "#2c7a59"
    },
    settings: {}
  });

  // Filter schools based on search term
  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle school form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (isEditDialogOpen && currentSchool) {
      if (name.startsWith("branding_colors.")) {
        const colorKey = name.split(".")[1] as "primary" | "secondary";
        setCurrentSchool({
          ...currentSchool,
          branding_colors: {
            ...currentSchool.branding_colors,
            [colorKey]: value
          }
        });
      } else {
        setCurrentSchool({
          ...currentSchool,
          [name]: value
        });
      }
    } else {
      if (name.startsWith("branding_colors.")) {
        const colorKey = name.split(".")[1] as "primary" | "secondary";
        setNewSchool({
          ...newSchool,
          branding_colors: {
            ...newSchool.branding_colors,
            [colorKey]: value
          }
        });
      } else {
        setNewSchool({
          ...newSchool,
          [name]: value
        });
      }
    }
  };

  // Handle adding a new school
  const handleAddSchool = () => {
    const now = new Date().toISOString();
    const newSchoolComplete: School = {
      id: crypto.randomUUID(),
      name: newSchool.name || "",
      domain: newSchool.domain || "",
      plan: newSchool.plan || "Basic",
      start_date: newSchool.start_date || now.split("T")[0],
      end_date: newSchool.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      timezone: newSchool.timezone || "UTC",
      locale: newSchool.locale || "en-US",
      branding_colors: newSchool.branding_colors || { primary: "#3ca377", secondary: "#2c7a59" },
      status: newSchool.status as "active" | "suspended" | "trial" || "trial",
      created_at: now,
      updated_at: now,
      settings: newSchool.settings || {}
    };

    setSchools([...schools, newSchoolComplete]);
    setNewSchool({
      name: "",
      domain: "",
      plan: "Basic",
      status: "trial",
      timezone: "UTC",
      locale: "en-US",
      branding_colors: {
        primary: "#3ca377",
        secondary: "#2c7a59"
      },
      settings: {}
    });
    setIsAddDialogOpen(false);
  };

  // Handle editing a school
  const handleEditSchool = () => {
    if (currentSchool) {
      setSchools(
        schools.map((school) =>
          school.id === currentSchool.id
            ? { ...currentSchool, updated_at: new Date().toISOString() }
            : school
        )
      );
      setIsEditDialogOpen(false);
      setCurrentSchool(null);
    }
  };

  // Handle deleting a school
  const handleDeleteSchool = () => {
    if (currentSchool) {
      setSchools(schools.filter((school) => school.id !== currentSchool.id));
      setIsDeleteDialogOpen(false);
      setCurrentSchool(null);
    }
  };

  // Render school form fields for add/edit dialogs
  const renderSchoolFormFields = () => {
    const school = isEditDialogOpen ? currentSchool : newSchool;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            School Name
          </label>
          <Input
            id="name"
            name="name"
            value={school?.name || ""}
            onChange={handleInputChange}
            placeholder="Enter school name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="domain" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Domain
          </label>
          <Input
            id="domain"
            name="domain"
            value={school?.domain || ""}
            onChange={handleInputChange}
            placeholder="example.edu"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="plan" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Plan
          </label>
          <Select
            id="plan"
            name="plan"
            value={school?.plan || "Basic"}
            onChange={handleInputChange}
          >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <Select
            id="status"
            name="status"
            value={school?.status || "trial"}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="trial">Trial</option>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={school?.start_date || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={school?.end_date || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Timezone
          </label>
          <Input
            id="timezone"
            name="timezone"
            value={school?.timezone || ""}
            onChange={handleInputChange}
            placeholder="e.g. Europe/Paris"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="locale" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Locale
          </label>
          <Input
            id="locale"
            name="locale"
            value={school?.locale || ""}
            onChange={handleInputChange}
            placeholder="e.g. en-US, fr-FR"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="branding_colors.primary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Primary Color
          </label>
          <div className="flex space-x-2">
            <Input
              type="color"
              id="branding_colors.primary"
              name="branding_colors.primary"
              value={school?.branding_colors?.primary || "#3ca377"}
              onChange={handleInputChange}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              id="branding_colors.primary_text"
              name="branding_colors.primary"
              value={school?.branding_colors?.primary || "#3ca377"}
              onChange={handleInputChange}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="branding_colors.secondary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Secondary Color
          </label>
          <div className="flex space-x-2">
            <Input
              type="color"
              id="branding_colors.secondary"
              name="branding_colors.secondary"
              value={school?.branding_colors?.secondary || "#2c7a59"}
              onChange={handleInputChange}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              id="branding_colors.secondary_text"
              name="branding_colors.secondary"
              value={school?.branding_colors?.secondary || "#2c7a59"}
              onChange={handleInputChange}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schools Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all your educational institutions
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <Input
                type="search"
                placeholder="Search schools..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.domain}</TableCell>
                    <TableCell>{school.plan}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[school.status]}>
                        {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{school.start_date}</TableCell>
                    <TableCell>{school.end_date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={()=> console.log("Menu opened")}>
                          {/* <Button variant="ghost" size="icon"> */}
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          {/* </Button> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentSchool(school);
                              setIsEditDialogOpen(true);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentSchool(school);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No schools found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add School Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
          </DialogHeader>
          {renderSchoolFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSchool}>Add School</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          {renderSchoolFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSchool}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete School Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete School</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete <strong>{currentSchool?.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchool}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagementPage;