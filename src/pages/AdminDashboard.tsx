// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import CreateUserModal from "@/components/CreateUserModal";
import AddPlaceModal from "@/components/AddPlaceModal";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import CreateMonthModal from "@/components/CreateMonthModal";
import AddEventModal from "@/components/AddEventModal";
import UpdateUserModal from "@/components/UpdateUserModal";
import UpdatePlaceModal from "@/components/UpdatePlaceModal";
import UpdateEventModal from "@/components/UpdateEventModal";
import ApprovalQueue from "@/components/ApprovalQueue";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, Calendar, CheckSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentHash = location.hash || "#user-management";
  const [users, setUsers] = useState([]);
  const navItems = [
    { name: "Users", path: "#user-management", icon: Users },
    { name: "Categories & Places", path: "#categories-places", icon: MapPin },
    { name: "Events & Months", path: "#events-months", icon: Calendar },
    { name: "Approvals", path: "#approvals", icon: CheckSquare },
  ];
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [items, setItems] = useState([]);

  const [months, setMonths] = useState([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  const [events, setEvents] = useState([]);

  const [tips, setTips] = useState([]);
  const [images, setImages] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      const data = await response.json();

      setUsers(data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const deleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete user");
          } else {
            toast.success("User deleted successfully");
          }
          // Refresh user list after deletion
          fetchUsers();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  //   ---

  const fetchItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/items`);
      const data = await response.json();

      setItems(data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();

      //   calculate item counts per category and save in itemCount
      const categoriesWithCounts = data.data.map((cat) => {
        const itemCount = items.filter((item) => item.categoryId === cat.placeId).length;
        return { ...cat, itemCount };
      });
      setCategories(categoriesWithCounts);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const deleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete category");
          } else {
            toast.success("Category deleted successfully");
          }
          // Refresh category list after deletion
          fetchCategories();
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
        });
    }
  };

  const deleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this place?")) {
      fetch(`${BASE_URL}/categories/items/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete place");
          } else {
            toast.success("Place deleted successfully");
          }
          // Refresh item list after deletion
          fetchItems();
        })
        .catch((error) => {
          console.error("Error deleting place:", error);
        });
    }
  };

  //   ---

  const fetchMonths = async () => {
    try {
      const response = await fetch(`${BASE_URL}/event-months`);
      const data = await response.json();

      //   calculate item counts per category and save in itemCount
      const monthsWithCounts = data.data.map((cat) => {
        const itemCount = events.filter((item) => item.monthId === cat.monthId).length;
        return { ...cat, itemCount };
      });
      setMonths(monthsWithCounts);
    } catch (err) {
      console.error("Error fetching months:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/events`);
      const data = await response.json();

      setEvents(data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const deleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete event");
          } else {
            toast.success("Event deleted successfully");
          }
          // Refresh event list after deletion
          fetchEvents();
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
        });
    }
  };

  const deleteMonth = (id: string) => {
    if (confirm("Are you sure you want to delete this month?")) {
      fetch(`${BASE_URL}/event-months/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete month");
          } else {
            toast.success("Month deleted successfully");
          }
          // Refresh month list after deletion
          fetchMonths();
        })
        .catch((error) => {
          console.error("Error deleting month:", error);
        });
    }
  };

  //   ---

  const fetchImages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/images`);
      const data = await response.json();

      // Sort by date (newest first)
      const loadedPhotos = data.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      console.log("Loaded Photos:", loadedPhotos);

      setImages(loadedPhotos);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const fetchTips = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tips`);
      const data = await response.json();

      // Sort by date (newest first)
      const loadedTips = data.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      setTips(loadedTips);
    } catch (err) {
      console.error("Error fetching tips:", err);
    }
  };

  // Fetch users on load
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      await fetchItems();
      await fetchEvents();
      await fetchTips();
      await fetchImages();
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [items]);

  useEffect(() => {
    fetchMonths();
  }, [events]);

  //   navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [location]);

  const handleRefresh = () => {
    fetchUsers();
    fetchItems();
    fetchEvents();
    fetchImages();
    fetchTips();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const logout = () => {
    navigate("/admin/login");
    localStorage.removeItem("authToken");
  };

  // Authentication demo
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    if (!authToken) {
      navigate("/unauthorized");
    }
  }, [authToken, navigate]);

  return (
    <div className="p-8">
      {/* Horizontal Nav */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center space-x-6 text-sm font-medium flex-1">
            {navItems.map((item) => {
              // Manually determine if this item is active
              const isActive = currentHash === item.path;

              return (
                <Link // Use Link instead of NavLink for manual control
                  key={item.path}
                  to={item.path}
                  className={cn("flex items-center gap-2 transition-colors hover:text-primary py-5", isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <button className="flex items-center gap-2 text-sm text-destructive hover:opacity-80" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Users */}
      <section id="user-management">
        <div className="flex justify-between items-center my-6">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <CreateUserModal onUserCreated={handleRefresh} />
        </div>

        <div className="bg-white rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <UpdateUserModal userInfo={user} onUserCreated={handleRefresh} />
                    <Button variant="destructive" size="icon" onClick={() => deleteUser(user.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Categories & Places */}
      <section id="categories-places" className="mt-16 border-t pt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Categories & Places</h2>
          <CreateCategoryModal onCreated={handleRefresh} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category List */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-lg">Categories</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat) => (
                <div
                  key={cat.placeId}
                  onClick={() => setSelectedCategoryId(cat.placeId)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedCategoryId === cat.placeId ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                  )}
                >
                  <div className="flex justify-between items-center" key={cat.placeId}>
                    <div>
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-xs opacity-70">{cat.itemCount || 0} Places</div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat.placeId);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Places Table for Selected Category */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Places</h3>
              {selectedCategoryId && <AddPlaceModal categories={categories} onCreated={handleRefresh} />}
            </div>

            <div className="bg-white rounded-md border max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedCategoryId ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        Select a category to view its places.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items
                      .filter((item) => item.categoryId === selectedCategoryId)
                      .map((item) => (
                        <TableRow key={item.placeId}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.address}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <UpdatePlaceModal placeInfo={item} categories={categories} onCreated={handleRefresh} />
                            <Button variant="destructive" size="icon" onClick={() => deleteItem(item.placeId)}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Months */}
      <section id="events-months" className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Months and Events</h2>
          <CreateMonthModal onCreated={handleRefresh} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Months List */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-lg">Months</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {months.map((cat) => (
                <div
                  key={cat.monthId}
                  onClick={() => setSelectedMonthId(cat.monthId)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedMonthId === cat.monthId ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                  )}
                >
                  <div className="flex justify-between items-center" key={cat.monthId}>
                    <div className="font-bold">{cat.month}</div>
                    <div className="text-xs opacity-70">{cat.itemCount || 0} Places</div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMonth(cat.monthId);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Places Table for Selected Category */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Events</h3>
              {selectedMonthId && <AddEventModal months={months} onCreated={handleRefresh} />}
            </div>

            <div className="bg-white rounded-md border max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedMonthId ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        Select a category to view its places.
                      </TableCell>
                    </TableRow>
                  ) : (
                    events
                      .filter((item) => item.monthId === selectedMonthId)
                      .map((item) => (
                        <TableRow key={item.placeId}>
                          <TableCell className="font-medium w-64">{item.name}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <UpdateEventModal eventInfo={item} months={months} onCreated={handleRefresh} />
                            <Button variant="destructive" size="icon" onClick={() => deleteEvent(item.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Content Approvals */}
      <section id="approvals" className="mt-16 mb-16 border-t pt-16">
        <h2 className="text-3xl font-bold mb-6">Content Approvals</h2>
        <ApprovalQueue images={images} tips={tips} onCreated={handleRefresh} />
      </section>
    </div>
  );
};

export default AdminDashboard;
