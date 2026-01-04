import React from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import CurrencyConverter from "@/components/CurrencyConverter";

/* -------------------------------------------------
   TYPES
--------------------------------------------------*/
interface ItineraryItem {
  id: number;
  date: string | null;
  time: string | null;
  title: string;
  location: string | null;
  notes: string | null;
  is_done?: boolean;
}

interface Expense {
  id: number;
  category: string | null;
  amount: string;
  spent_on: string | null;
  notes: string | null;
}

interface ChecklistItem {
  id: number;
  type: "packing" | "task";
  title: string;
  is_done: boolean;
  due_date: string | null;
}

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  price_per_night: string | null;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number;
  rating: number | null;
  amenities: string | null;
  booking_reference: string | null;
  status: string;
}

interface Transport {
  id: number;
  type: string;
  provider: string | null;
  from_location: string;
  to_location: string;
  departure_time: string;
  arrival_time: string | null;
  duration_hours: string | null;
  cost: string | null;
  booking_reference: string | null;
  confirmation_number: string | null;
  seats: number | null;
  notes: string | null;
  status: string;
}

interface Trip {
  id: number;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  budget: string | null;
  itinerary_items: ItineraryItem[];
  expenses: Expense[];
  checklist_items: ChecklistItem[];
  accommodations: Accommodation[];
  transports: Transport[];
}

interface ShareComment {
  id: number;
  name: string;
  email: string | null;
  body: string;
  created_at: string;
}

interface ShowPageProps {
  trip: Trip;
  totalSpent: number;
  share?: { url: string | null };
  shareComments?: ShareComment[];
  journalEntries?: JournalEntry[];
  isCompleted?: boolean;
  flash?: { success?: string };
  [key: string]: any;
}


interface JournalEntry {
  id: number;
  entry_date: string | null;
  title: string | null;
  body: string;
  created_at: string;
}



/* -------------------------------------------------
   HELPERS
--------------------------------------------------*/
const formatDateOnly = (value: string | null | undefined) => {
  if (!value) return "";
  return value.slice(0, 10); // YYYY-MM-DD
};

/* -------------------------------------------------
   BLUE MODERN MODAL COMPONENT
--------------------------------------------------*/

function BlueModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-slate-100 rounded-xl shadow-2xl w-full max-w-md p-6 border border-blue-200 text-slate-900">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">{title}</h2>

        <div className="space-y-3">{children}</div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------*/
export default function Show() {
  const { props } = usePage<ShowPageProps>();
  const { trip, totalSpent, flash, share, shareComments, journalEntries, isCompleted } = props;

  const tripStartDate = formatDateOnly(trip.start_date);
  const tripEndDate = formatDateOnly(trip.end_date);

  /* ---------------------------------------------
      FORMS
  ----------------------------------------------*/

  // Itinerary create form
  const itineraryForm = useForm({
    date: "",
    time: "",
    title: "",
    location: "",
    notes: "",
  });

  // Itinerary edit modal state
  const [editItineraryOpen, setEditItineraryOpen] = React.useState(false);
  const [editingItineraryId, setEditingItineraryId] = React.useState<number | null>(null);

  const editItineraryForm = useForm({
    date: "",
    time: "",
    title: "",
    location: "",
    notes: "",
  });

  // Expense create form
  const expenseForm = useForm({
    category: "",
    amount: "",
    spent_on: "",
    notes: "",
  });

  // Expense edit modal
  const [editExpenseOpen, setEditExpenseOpen] = React.useState(false);
  const [editingExpenseId, setEditingExpenseId] = React.useState<number | null>(null);

  const editExpenseForm = useForm({
    category: "",
    amount: "",
    spent_on: "",
    notes: "",
  });

  // Packing create
  const packingForm = useForm({
    type: "packing" as const,
    title: "",
  });

  // Task create
  const taskForm = useForm({
    type: "task" as const,
    title: "",
    due_date: "",
  });

  // Checklist edit modal
  const [editChecklistOpen, setEditChecklistOpen] = React.useState(false);
  const [editingChecklistId, setEditingChecklistId] = React.useState<number | null>(null);

  const editChecklistForm = useForm({
    title: "",
    due_date: "",
  });

  //journal
  const journalForm = useForm({
    entry_date: "",
    title: "",
    body: "",
  });

  const submitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    journalForm.post(`/trips/${trip.id}/journal`, { preserveScroll: true });
  };

  // Accommodation create form
  const accommodationForm = useForm({
    name: "",
    type: "",
    location: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    price_per_night: "",
    check_in_date: "",
    check_out_date: "",
    rating: "",
    amenities: "",
    booking_reference: "",
    status: "pending",
  });

  // Accommodation edit modal
  const [editAccommodationOpen, setEditAccommodationOpen] = React.useState(false);
  const [editingAccommodationId, setEditingAccommodationId] = React.useState<number | null>(null);

  const editAccommodationForm = useForm({
    name: "",
    type: "",
    location: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    price_per_night: "",
    check_in_date: "",
    check_out_date: "",
    rating: "",
    amenities: "",
    booking_reference: "",
    status: "pending",
  });

  // Transport create form
  const transportForm = useForm({
    type: "",
    provider: "",
    from_location: "",
    to_location: "",
    departure_time: "",
    arrival_time: "",
    duration_hours: "",
    cost: "",
    booking_reference: "",
    confirmation_number: "",
    seats: "",
    notes: "",
    status: "pending",
  });

  // Transport edit modal
  const [editTransportOpen, setEditTransportOpen] = React.useState(false);
  const [editingTransportId, setEditingTransportId] = React.useState<number | null>(null);

  const editTransportForm = useForm({
    type: "",
    provider: "",
    from_location: "",
    to_location: "",
    departure_time: "",
    arrival_time: "",
    duration_hours: "",
    cost: "",
    booking_reference: "",
    confirmation_number: "",
    seats: "",
    notes: "",
    status: "pending",
  });
  
  //share
  const [shareOpen, setShareOpen] = React.useState(false);

  const generateShareLink = () => {
    router.post(`/trips/${trip.id}/share-link`, {}, { preserveScroll: true });
  };

  const revokeShareLink = () => {
    router.delete(`/trips/${trip.id}/share-link`, { preserveScroll: true });
  };

  const copyShareLink = async () => {
    if (!share?.url) return;
    try {
      await navigator.clipboard.writeText(share.url);
      alert("Link copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  // Weather state
  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [weatherLoading, setWeatherLoading] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState<string | null>(null);

  const fetchWeather = async () => {
    if (!trip.destination) {
      setWeatherError("No destination set for this trip");
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const response = await fetch(`/api/weather/trip/${trip.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setWeatherError("Unable to load weather data");
      console.error("Weather fetch error:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch weather when destination changes
  React.useEffect(() => {
    if (trip.destination) {
      fetchWeather();
    }
  }, [trip.destination]);


  /* -------------------------------------------------
     HANDLERS
  --------------------------------------------------*/

  // ----- Itinerary: Create -----
  const handleItinerarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    itineraryForm.post(`/trips/${trip.id}/itinerary-items`, {
      onSuccess: () =>
        itineraryForm.reset("date", "time", "title", "location", "notes"),
    });
  };

  // ----- Itinerary: Open modal for editing -----
  const startEditItinerary = (item: ItineraryItem) => {
    setEditingItineraryId(item.id);
    editItineraryForm.setData({
      date: item.date ?? "",
      time: item.time ?? "",
      title: item.title ?? "",
      location: item.location ?? "",
      notes: item.notes ?? "",
    });
    setEditItineraryOpen(true);
  };

  // ----- Itinerary: Save edit -----
  const handleItineraryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItineraryId) return;

    editItineraryForm.patch(`/itinerary-items/${editingItineraryId}`, {
      onSuccess: () => {
        setEditItineraryOpen(false);
        setEditingItineraryId(null);
      },
    });
  };

  // ----- Expense: Create -----
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    expenseForm.post(`/trips/${trip.id}/expenses`, {
      onSuccess: () =>
        expenseForm.reset("category", "amount", "spent_on", "notes"),
    });
  };

  // ----- Expense: Open modal for editing -----
  const startEditExpense = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    editExpenseForm.setData({
      category: exp.category ?? "",
      amount: exp.amount ?? "",
      spent_on: exp.spent_on ?? "",
      notes: exp.notes ?? "",
    });
    setEditExpenseOpen(true);
  };

  // ----- Expense: Save edit -----
  const handleExpenseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpenseId) return;

    editExpenseForm.patch(`/expenses/${editingExpenseId}`, {
      onSuccess: () => {
        setEditExpenseOpen(false);
        setEditingExpenseId(null);
      },
    });
  };

  // ----- Packing create -----
  const handlePackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    packingForm.post(`/trips/${trip.id}/checklist-items`, {
      onSuccess: () => packingForm.reset("title"),
    });
  };

  // ----- Task create -----
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    taskForm.post(`/trips/${trip.id}/checklist-items`, {
      onSuccess: () => taskForm.reset("title", "due_date"),
    });
  };

  // ----- Checklist toggle -----
  const toggleChecklistItem = (id: number) => {
    router.patch(`/checklist-items/${id}/toggle`);
  };

  // ----- Checklist delete -----
  const deleteChecklistItem = (id: number) => {
    router.delete(`/checklist-items/${id}`);
  };

  // ----- Checklist edit modal open -----
  const startEditChecklist = (item: ChecklistItem) => {
    setEditingChecklistId(item.id);
    editChecklistForm.setData({
      title: item.title,
      due_date: item.due_date ?? "",
    });
    setEditChecklistOpen(true);
  };

  // ----- Checklist save edit -----
  const handleChecklistEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChecklistId) return;

    editChecklistForm.patch(`/checklist-items/${editingChecklistId}`, {
      onSuccess: () => {
        setEditChecklistOpen(false);
        setEditingChecklistId(null);
      },
    });
  };

  // ----- Accommodation: Create -----
  const handleAccommodationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    accommodationForm.post(`/trips/${trip.id}/accommodations`, {
      onSuccess: () =>
        accommodationForm.reset(
          "name",
          "type",
          "location",
          "description",
          "address",
          "phone",
          "email",
          "website",
          "price_per_night",
          "check_in_date",
          "check_out_date",
          "rating",
          "amenities",
          "booking_reference",
          "status"
        ),
    });
  };

  // ----- Accommodation: Open modal for editing -----
  const startEditAccommodation = (acc: Accommodation) => {
    setEditingAccommodationId(acc.id);
    editAccommodationForm.setData({
      name: acc.name ?? "",
      type: acc.type ?? "",
      location: acc.location ?? "",
      description: acc.description ?? "",
      address: acc.address ?? "",
      phone: acc.phone ?? "",
      email: acc.email ?? "",
      website: acc.website ?? "",
      price_per_night: acc.price_per_night ?? "",
      check_in_date: acc.check_in_date ?? "",
      check_out_date: acc.check_out_date ?? "",
      rating: acc.rating?.toString() ?? "",
      amenities: acc.amenities ?? "",
      booking_reference: acc.booking_reference ?? "",
      status: acc.status ?? "pending",
    });
    setEditAccommodationOpen(true);
  };

  // ----- Accommodation: Save edit -----
  const handleAccommodationEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccommodationId) return;

    editAccommodationForm.patch(`/accommodations/${editingAccommodationId}`, {
      onSuccess: () => {
        setEditAccommodationOpen(false);
        setEditingAccommodationId(null);
      },
    });
  };

  // ----- Transport: Create -----
  const handleTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transportForm.post(`/trips/${trip.id}/transports`, {
      onSuccess: () =>
        transportForm.reset(
          "type",
          "provider",
          "from_location",
          "to_location",
          "departure_time",
          "arrival_time",
          "duration_hours",
          "cost",
          "booking_reference",
          "confirmation_number",
          "seats",
          "notes",
          "status"
        ),
    });
  };

  // ----- Transport: Open modal for editing -----
  const startEditTransport = (trans: Transport) => {
    setEditingTransportId(trans.id);
    editTransportForm.setData({
      type: trans.type ?? "",
      provider: trans.provider ?? "",
      from_location: trans.from_location ?? "",
      to_location: trans.to_location ?? "",
      departure_time: trans.departure_time ?? "",
      arrival_time: trans.arrival_time ?? "",
      duration_hours: trans.duration_hours ?? "",
      cost: trans.cost ?? "",
      booking_reference: trans.booking_reference ?? "",
      confirmation_number: trans.confirmation_number ?? "",
      seats: trans.seats?.toString() ?? "",
      notes: trans.notes ?? "",
      status: trans.status ?? "pending",
    });
    setEditTransportOpen(true);
  };

  // ----- Transport: Save edit -----
  const handleTransportEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransportId) return;

    editTransportForm.patch(`/transports/${editingTransportId}`, {
      onSuccess: () => {
        setEditTransportOpen(false);
        setEditingTransportId(null);
      },
    });
  };

  const budget = trip.budget ? parseFloat(trip.budget) : null;
  const spent = Number(totalSpent || 0);
  const remaining = budget !== null ? budget - spent : null;

  const packingItems =
    trip.checklist_items?.filter((i) => i.type === "packing") || [];
  const taskItems =
    trip.checklist_items?.filter((i) => i.type === "task") || [];

  
  /* -------------------------------------------------
     RENDER
  --------------------------------------------------*/

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-4 py-8">
      <Head title={trip.title} />

      <div className="mx-auto max-w-5xl flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
            <p className="text-sm text-blue-600">
              {trip.destination}
              {trip.start_date && trip.end_date && (
                <> • {tripStartDate} → {tripEndDate}</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.get("/dashboard")}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Return to Dashboard
            </button>

            <button
              type="button"
              onClick={() => router.get("/trips")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Back to Trips
            </button>

            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Share
            </button>

          </div>
        </div>

        {flash?.success && (
          <div className="px-4 py-2 rounded-md bg-green-100 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        <BlueModal
          open={shareOpen}
          title="Share Trip Plan"
          onClose={() => setShareOpen(false)}
        >
          {share?.url ? (
            <>
              <p className="text-sm text-slate-700">
                Anyone with this link can view your trip details (read-only).
              </p>

              <input
                value={share.url}
                readOnly
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Copy Link
                </button>

                <button
                  type="button"
                  onClick={generateShareLink}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Regenerate
                </button>
              </div>

              <button
                type="button"
                onClick={revokeShareLink}
                className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Revoke Link
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-700">
                Generate a shareable link for friends or family to view this trip.
              </p>

              <button
                type="button"
                onClick={generateShareLink}
                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Generate Share Link
              </button>
            </>
          )}
        </BlueModal>
        {/* 🔼🔼🔼 SHARE MODAL ENDS HERE 🔼🔼🔼 */}

        {/* DESCRIPTION */}
        {trip.description && (
          <div className="bg-slate-100 border border-blue-100 rounded-lg p-4">
            <h2 className="font-semibold mb-1 text-lg text-blue-700">Overview</h2>
            <p className="text-sm text-slate-900 whitespace-pre-line">
              {trip.description}
            </p>
          </div>
        )}

        {/* ----------------------------- */}
        {/*  WEATHER FORECAST SECTION    */}
        {/* ----------------------------- */}
        {trip.destination && (
          <section className="bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-100 shadow-md rounded-xl p-5 mt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <span>🌤️</span> Weather Forecast
              </h2>
              <button
                onClick={fetchWeather}
                disabled={weatherLoading}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {weatherLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {weatherLoading && !weatherData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-slate-600 mt-2">Loading weather data...</p>
              </div>
            ) : weatherError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-700">{weatherError}</p>
              </div>
            ) : weatherData?.weather ? (
              <div className="space-y-4">
                {/* Main Weather Card */}
                <div className="bg-white rounded-lg p-5 shadow border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        {weatherData.weather.temperature}°C
                      </p>
                      <p className="text-sm text-slate-600">
                        Feels like {weatherData.weather.feels_like}°C
                      </p>
                      <p className="text-lg font-semibold text-blue-700 mt-1">
                        {weatherData.weather.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {weatherData.weather.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-5xl mb-2">
                        {weatherData.weather.condition === "Clear" && "☀️"}
                        {weatherData.weather.condition === "Clouds" && "☁️"}
                        {weatherData.weather.condition === "Rain" && "🌧️"}
                        {weatherData.weather.condition === "Snow" && "❄️"}
                        {weatherData.weather.condition === "Thunderstorm" && "⛈️"}
                        {!["Clear", "Clouds", "Rain", "Snow", "Thunderstorm"].includes(weatherData.weather.condition) && "🌤️"}
                      </div>
                      {weatherData.weather.is_demo && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Demo Data
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Temperature Range */}
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">High</p>
                        <p className="text-lg font-semibold text-blue-800">
                          {weatherData.weather.temp_max}°C
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600">Low</p>
                        <p className="text-lg font-semibold text-blue-800">
                          {weatherData.weather.temp_min}°C
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-4 shadow border border-blue-100">
                    <p className="text-xs text-slate-600 mb-1">💧 Humidity</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {weatherData.weather.humidity}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow border border-blue-100">
                    <p className="text-xs text-slate-600 mb-1">💨 Wind Speed</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {weatherData.weather.wind_speed} m/s
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow border border-blue-100">
                    <p className="text-xs text-slate-600 mb-1">🌫️ Visibility</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {weatherData.weather.visibility} km
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow border border-blue-100">
                    <p className="text-xs text-slate-600 mb-1">☁️ Clouds</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {weatherData.weather.clouds}%
                    </p>
                  </div>
                </div>

                {/* Trip Dates Info */}
                {(weatherData.trip_dates?.start || weatherData.trip_dates?.end) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-700 mb-2">
                      📅 Your Trip Duration
                    </p>
                    <div className="flex gap-4 text-sm">
                      {weatherData.trip_dates.start && (
                        <div>
                          <span className="text-slate-600">Check-in: </span>
                          <span className="font-medium text-blue-900">
                            {new Date(weatherData.trip_dates.start).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {weatherData.trip_dates.end && (
                        <div>
                          <span className="text-slate-600">Check-out: </span>
                          <span className="font-medium text-blue-900">
                            {new Date(weatherData.trip_dates.end).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      💡 Plan your activities based on the weather conditions shown above
                    </p>
                  </div>
                )}

                {/* Weather Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2">
                    ✨ Weather Tips
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {weatherData.weather.temperature > 30 && (
                      <li>• High temperature expected - Stay hydrated and use sun protection</li>
                    )}
                    {weatherData.weather.temperature < 10 && (
                      <li>• Low temperature expected - Pack warm clothing</li>
                    )}
                    {weatherData.weather.condition === "Rain" && (
                      <li>• Rain expected - Don't forget your umbrella and waterproof gear</li>
                    )}
                    {weatherData.weather.humidity > 70 && (
                      <li>• High humidity - Light, breathable clothing recommended</li>
                    )}
                    {weatherData.weather.wind_speed > 10 && (
                      <li>• Windy conditions - Secure loose items and consider indoor activities</li>
                    )}
                    {weatherData.weather.condition === "Clear" && weatherData.weather.temperature > 20 && weatherData.weather.temperature < 30 && (
                      <li>• Perfect weather conditions for outdoor activities!</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-600">
                  Weather data will appear here once loaded
                </p>
              </div>
            )}
          </section>
        )}

        {/* ----------------------------- */}
        {/*  BUDGET & EXPENSES SECTION   */}
        {/* ----------------------------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BUDGET CARD */}
          <div className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Budget & Expenses
            </h2>
            <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Currency Converter
              </summary>

              <div className="mt-4">
                <CurrencyConverter />
              </div>
            </details>


            {budget === null ? (
              <p className="text-sm text-slate-800">
                No budget set. You can still track expenses below.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Budget:</span>{" "}
                  {budget.toFixed(2)} $
                </p>
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Total Spent:</span>{" "}
                  {spent.toFixed(2)} $
                </p>
                <p className="text-blue-900">
                  <span className="font-medium text-blue-600">Remaining:</span>{" "}
                  {remaining !== null ? remaining.toFixed(2) : "-"} $
                </p>

                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500"
                    style={{
                      width:
                        budget > 0 ? `${Math.min(100, (spent / budget) * 100)}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Add Expense */}
            <form
              onSubmit={handleExpenseSubmit}
              className="mt-4 space-y-3 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100"
            >
              <h3 className="font-semibold text-blue-700">Add Expense</h3>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="e.g., Transport, Food, Hotel"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={expenseForm.data.category}
                  onChange={(e) => expenseForm.setData("category", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Short label for where the money was spent.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 120.50"
                      className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-7 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                      value={expenseForm.data.amount}
                      onChange={(e) =>
                        expenseForm.setData("amount", e.target.value)
                      }
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Enter the cost in your preferred currency.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                    value={expenseForm.data.spent_on}
                    onChange={(e) =>
                      expenseForm.setData("spent_on", e.target.value)
                    }
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    When did you spend this amount?
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Notes (optional)
                </label>
                <textarea
                  placeholder="Add any extra detail about this expense."
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  rows={2}
                  value={expenseForm.data.notes}
                  onChange={(e) => expenseForm.setData("notes", e.target.value)}
                ></textarea>
                <p className="mt-1 text-[11px] text-slate-500">
                  Example: Paid in cash, shared with a friend, etc.
                </p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-600 rounded-md text-white shadow hover:bg-blue-700"
              >
                Add Expense
              </button>
            </form>
          </div>

          {/* EXPENSE LIST */}
          <div className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Expense List
            </h2>

            {trip.expenses.length === 0 ? (
              <p className="text-sm text-slate-800">No expenses yet.</p>
            ) : (
              <ul className="space-y-3">
                {trip.expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="p-3 border rounded-lg bg-blue-50 border-blue-200 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-blue-800">
                        {exp.category} – {exp.amount} $
                      </p>
                      <p className="text-xs text-slate-800">
                        {formatDateOnly(exp.spent_on)}
                        {exp.notes && <> • {exp.notes}</>}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => startEditExpense(exp)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => expenseForm.delete(`/expenses/${exp.id}`)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ----------------------------- */}
        {/*      ITINERARY SECTION       */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 border border-blue-100 shadow-md rounded-xl p-5 mt-2">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Itinerary</h2>

          {/* Add Itinerary */}
          <form
            onSubmit={handleItinerarySubmit}
            className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={tripStartDate || undefined}
                  max={tripEndDate || undefined}
                  className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                  value={itineraryForm.data.date}
                  onChange={(e) => itineraryForm.setData("date", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Choose a date within your trip range.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Time (optional)
                </label>
                <input
                  type="time"
                  className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                  value={itineraryForm.data.time}
                  onChange={(e) =>
                    itineraryForm.setData("time", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Helpful to remember exact schedule.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ex: Beach visit, City tour"
                  className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                  value={itineraryForm.data.title}
                  onChange={(e) =>
                    itineraryForm.setData("title", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Short name for this activity.
                </p>
              </div>
            </div>

            {tripStartDate && tripEndDate && (
              <p className="text-[11px] text-gray-500">
                Itinerary dates should be between {tripStartDate} and {tripEndDate}.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Location (optional)
                </label>
                <input
                  placeholder="Ex: Cox's Bazar Sea Beach"
                  className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                  value={itineraryForm.data.location}
                  onChange={(e) =>
                    itineraryForm.setData("location", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Where this activity will take place.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Notes (optional)
                </label>
                <input
                  placeholder="Add any extra info or reminders."
                  className="border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
                  value={itineraryForm.data.notes}
                  onChange={(e) =>
                    itineraryForm.setData("notes", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Example: Meet guide at 9:00 AM at hotel lobby.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 shadow w-full"
            >
              Add Itinerary Item
            </button>
          </form>

          <ul className="mt-4 space-y-3">
            {trip.itinerary_items.length === 0 ? (
              <p className="text-sm text-slate-800">No itinerary items yet.</p>
            ) : (
              trip.itinerary_items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-blue-900">{item.title}</p>
                    <p className="text-xs text-slate-800">
                      {formatDateOnly(item.date)}
                      {item.time && ` • ${item.time.slice(0, 5)}`}
                      {item.location && ` • ${item.location}`}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-slate-900">{item.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => startEditItinerary(item)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        itineraryForm.delete(`/itinerary-items/${item.id}`)
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* ----------------------------- */}
        {/*  CHECKLIST (PACKING + TASKS) */}
        {/* ----------------------------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* PACKING LIST */}
          <div className="bg-slate-100 border border-blue-100 shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">
              Packing List
            </h2>

            {/* Add packing item */}
            <form
              onSubmit={handlePackingSubmit}
              className="flex gap-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Item <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ex: Passport, Charger, Sunglasses"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={packingForm.data.title}
                  onChange={(e) =>
                    packingForm.setData("title", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Add things you must remember to pack.
                </p>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>

            {packingItems.length === 0 ? (
              <p className="text-sm text-slate-800">No packing items yet.</p>
            ) : (
              <ul className="space-y-3">
                {packingItems.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 border bg-blue-50 rounded-lg border-blue-200 flex justify-between items-center"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_done}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <span
                        className={
                          item.is_done
                            ? "line-through text-gray-500"
                            : "text-blue-900"
                        }
                      >
                        {item.title}
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditChecklist(item)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* TASK LIST */}
          <div className="bg-slate-100 border border-blue-100 shadow-md rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">Tasks</h2>

            {/* Add task */}
            <form
              onSubmit={handleTaskSubmit}
              className="space-y-3 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ex: Book hotel, Confirm tickets"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={taskForm.data.title}
                  onChange={(e) => taskForm.setData("title", e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Add actions you need to complete before or during the trip.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={taskForm.data.due_date}
                  onChange={(e) =>
                    taskForm.setData("due_date", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Set a deadline to keep yourself on track.
                </p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 w-full"
              >
                Add Task
              </button>
            </form>

            {taskItems.length === 0 ? (
              <p className="text-sm text-slate-800">No tasks yet.</p>
            ) : (
              <ul className="space-y-3">
                {taskItems.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 border bg-blue-50 rounded-lg border-blue-200 flex justify-between items-center"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.is_done}
                        onChange={() => toggleChecklistItem(item.id)}
                      />
                      <span
                        className={
                          item.is_done
                            ? "line-through text-gray-500"
                            : "text-blue-900"
                        }
                      >
                        {item.title}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      {item.due_date && (
                        <span className="text-xs text-slate-800">
                          Due: {formatDateOnly(item.due_date)}
                        </span>
                      )}
                      <button
                        onClick={() => startEditChecklist(item)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ----------------------------- */}
        {/*  ACCOMMODATIONS SECTION      */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 border border-blue-100 shadow-md rounded-xl p-5 mt-2">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">
            Accommodations
          </h2>

          {/* Add Accommodation */}
          <form
            onSubmit={handleAccommodationSubmit}
            className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ex: Grand Hotel, Airbnb Apt"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.name}
                  onChange={(e) =>
                    accommodationForm.setData("name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.type}
                  onChange={(e) =>
                    accommodationForm.setData("type", e.target.value)
                  }
                >
                  <option value="">Select type</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Resort">Resort</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="City or area"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.location}
                  onChange={(e) =>
                    accommodationForm.setData("location", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Check-in <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.check_in_date}
                  onChange={(e) =>
                    accommodationForm.setData("check_in_date", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Check-out <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.check_out_date}
                  onChange={(e) =>
                    accommodationForm.setData("check_out_date", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Price per Night (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.price_per_night}
                  onChange={(e) =>
                    accommodationForm.setData("price_per_night", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Phone (optional)
                </label>
                <input
                  placeholder="+1-234-567-8900"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.phone}
                  onChange={(e) =>
                    accommodationForm.setData("phone", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="contact@hotel.com"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.email}
                  onChange={(e) =>
                    accommodationForm.setData("email", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Address (optional)
                </label>
                <input
                  placeholder="Full address"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.address}
                  onChange={(e) =>
                    accommodationForm.setData("address", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Website (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://hotel.com"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.website}
                  onChange={(e) =>
                    accommodationForm.setData("website", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Description (optional)
              </label>
              <textarea
                placeholder="Notes about this accommodation..."
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                rows={2}
                value={accommodationForm.data.description}
                onChange={(e) =>
                  accommodationForm.setData("description", e.target.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Booking Reference (optional)
                </label>
                <input
                  placeholder="Booking ID"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.booking_reference}
                  onChange={(e) =>
                    accommodationForm.setData("booking_reference", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Rating (optional)
                </label>
                <select
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.rating}
                  onChange={(e) =>
                    accommodationForm.setData("rating", e.target.value)
                  }
                >
                  <option value="">Select rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Status (optional)
                </label>
                <select
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={accommodationForm.data.status}
                  onChange={(e) =>
                    accommodationForm.setData("status", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 rounded-md text-white shadow hover:bg-blue-700"
            >
              Add Accommodation
            </button>
          </form>

          {/* Accommodation List */}
          {trip.accommodations.length === 0 ? (
            <p className="text-sm text-slate-800">No accommodations yet.</p>
          ) : (
            <ul className="space-y-3">
              {trip.accommodations.map((acc) => (
                <li
                  key={acc.id}
                  className="p-4 border rounded-lg bg-blue-50 border-blue-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-blue-800">
                        {acc.name} ({acc.type})
                      </p>
                      <p className="text-xs text-slate-600">
                        {acc.location} • {acc.check_in_date} to {acc.check_out_date}
                        {acc.rating && ` • ⭐ ${acc.rating}/5`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        acc.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : acc.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>

                  {acc.description && (
                    <p className="text-sm text-slate-700 mb-2">
                      {acc.description}
                    </p>
                  )}

                  {acc.price_per_night && (
                    <p className="text-sm text-blue-700 font-medium">
                      ${acc.price_per_night} per night ({acc.number_of_nights} nights)
                    </p>
                  )}

                  {(acc.address || acc.phone || acc.email) && (
                    <p className="text-xs text-slate-600 mt-2">
                      {acc.address && <>{acc.address}</>}
                      {acc.phone && <>  • {acc.phone}</>}
                      {acc.email && <>  • {acc.email}</>}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEditAccommodation(acc)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        accommodationForm.delete(
                          `/accommodations/${acc.id}`
                        )
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ----------------------------- */}
        {/*  TRANSPORT SECTION           */}
        {/* ----------------------------- */}
        <section className="bg-slate-100 border border-blue-100 shadow-md rounded-xl p-5 mt-2">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">
            Transport
          </h2>

          {/* Add Transport */}
          <form
            onSubmit={handleTransportSubmit}
            className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.type}
                  onChange={(e) =>
                    transportForm.setData("type", e.target.value)
                  }
                >
                  <option value="">Select type</option>
                  <option value="Flight">Flight</option>
                  <option value="Train">Train</option>
                  <option value="Bus">Bus</option>
                  <option value="Car Rental">Car Rental</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Provider (optional)
                </label>
                <input
                  placeholder="Ex: Airline, Train Company"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.provider}
                  onChange={(e) =>
                    transportForm.setData("provider", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Cost (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.cost}
                  onChange={(e) =>
                    transportForm.setData("cost", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  From <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Departure location"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.from_location}
                  onChange={(e) =>
                    transportForm.setData("from_location", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  To <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Arrival location"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.to_location}
                  onChange={(e) =>
                    transportForm.setData("to_location", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Departure <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.departure_time}
                  onChange={(e) =>
                    transportForm.setData("departure_time", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Arrival (optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.arrival_time}
                  onChange={(e) =>
                    transportForm.setData("arrival_time", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Duration Hours (optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.duration_hours}
                  onChange={(e) =>
                    transportForm.setData("duration_hours", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Booking Reference (optional)
                </label>
                <input
                  placeholder="Booking ID"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.booking_reference}
                  onChange={(e) =>
                    transportForm.setData("booking_reference", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Confirmation Number (optional)
                </label>
                <input
                  placeholder="Confirmation #"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.confirmation_number}
                  onChange={(e) =>
                    transportForm.setData("confirmation_number", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Number of Seats (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.seats}
                  onChange={(e) =>
                    transportForm.setData("seats", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Status (optional)
                </label>
                <select
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={transportForm.data.status}
                  onChange={(e) =>
                    transportForm.setData("status", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Notes (optional)
              </label>
              <textarea
                placeholder="Additional details about this transport..."
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                rows={2}
                value={transportForm.data.notes}
                onChange={(e) =>
                  transportForm.setData("notes", e.target.value)
                }
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 rounded-md text-white shadow hover:bg-blue-700"
            >
              Add Transport
            </button>
          </form>

          {/* Transport List */}
          {trip.transports.length === 0 ? (
            <p className="text-sm text-slate-800">No transport yet.</p>
          ) : (
            <ul className="space-y-3">
              {trip.transports.map((trans) => (
                <li
                  key={trans.id}
                  className="p-4 border rounded-lg bg-blue-50 border-blue-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-blue-800">
                        {trans.type}
                        {trans.provider && ` - ${trans.provider}`}
                      </p>
                      <p className="text-xs text-slate-600">
                        {trans.from_location} → {trans.to_location}
                      </p>
                      <p className="text-xs text-slate-600">
                        {trans.departure_time
                          ? trans.departure_time.slice(0, 16).replace("T", " ")
                          : "No date"}
                        {trans.arrival_time &&
                          ` - ${trans.arrival_time.slice(0, 16).replace("T", " ")}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        trans.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : trans.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : trans.status === "in-progress"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trans.status}
                    </span>
                  </div>

                  {trans.cost && (
                    <p className="text-sm text-blue-700 font-medium mb-2">
                      ${trans.cost}
                    </p>
                  )}

                  {(trans.booking_reference || trans.confirmation_number) && (
                    <p className="text-xs text-slate-600 mb-2">
                      {trans.booking_reference &&
                        `Booking: ${trans.booking_reference}`}
                      {trans.confirmation_number &&
                        `  Confirmation: ${trans.confirmation_number}`}
                    </p>
                  )}

                  {trans.notes && (
                    <p className="text-sm text-slate-700 mb-2">
                      {trans.notes}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEditTransport(trans)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        transportForm.delete(`/transports/${trans.id}`)
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* COMMENTS */}
        <section className="bg-slate-100 shadow-md rounded-xl p-5 border border-blue-100">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">
            Shared Link Comments
          </h2>

          <button
            type="button"
            onClick={() => router.reload({ only: ["shareComments"] })}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Refresh Comments
          </button>

          {!share?.url ? (
            <p className="text-sm text-slate-700">
              No share link generated yet. Generate a share link to collect comments.
            </p>
          ) : (shareComments && shareComments.length > 0 ? (
            <div className="space-y-3">
              {shareComments.map((cm) => (
                <div key={cm.id} className="p-3 border rounded-lg bg-white border-blue-100">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{cm.name}</p>
                    <p className="text-xs text-slate-500">
                      {cm.created_at ? cm.created_at.slice(0, 19).replace("T", " ") : ""}
                    </p>
                  </div>

                  <p className="text-sm text-slate-800 mt-2 whitespace-pre-line">
                    {cm.body}
                  </p>

                  {cm.email && (
                    <p className="text-xs text-slate-500 mt-2">{cm.email}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-700">
              No comments yet.
            </p>
          ))}
        </section>

        {/*Journal*/}
        <button
          onClick={() => router.visit(`/trips/${trip.id}/journal`)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
        >
          Journal
        </button>

         

        {/* REQUIRED FIELDS NOTE */}
        <p className="text-[11px] text-slate-500 mt-2">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

        {/* ----------------------------- */}
        {/* EDIT MODALS                  */}
        {/* ----------------------------- */}

        {/* EXPENSE EDIT MODAL */}
        <BlueModal
          open={editExpenseOpen}
          title="Edit Expense"
          onClose={() => setEditExpenseOpen(false)}
        >
          <form onSubmit={handleExpenseEdit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Category"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editExpenseForm.data.category}
                onChange={(e) =>
                  editExpenseForm.setData("category", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Describe what this expense was for.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  $
                </span>
                <input
                  placeholder="Amount"
                  type="number"
                  step="0.01"
                  className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-7 py-2 focus:ring-2 focus:ring-blue-400"
                  value={editExpenseForm.data.amount}
                  onChange={(e) =>
                    editExpenseForm.setData("amount", e.target.value)
                  }
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Update the correct value if needed.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editExpenseForm.data.spent_on}
                onChange={(e) =>
                  editExpenseForm.setData("spent_on", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                When this expense actually happened.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Notes (optional)
              </label>
              <textarea
                placeholder="Notes"
                rows={2}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editExpenseForm.data.notes}
                onChange={(e) =>
                  editExpenseForm.setData("notes", e.target.value)
                }
              ></textarea>
              <p className="mt-1 text-[11px] text-slate-500">
                Add any extra context you want to remember.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </BlueModal>

        {/* ITINERARY EDIT MODAL */}
        <BlueModal
          open={editItineraryOpen}
          title="Edit Itinerary Item"
          onClose={() => setEditItineraryOpen(false)}
        >
          <form onSubmit={handleItineraryEdit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={tripStartDate || undefined}
                max={tripEndDate || undefined}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editItineraryForm.data.date}
                onChange={(e) =>
                  editItineraryForm.setData("date", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Keep it within the trip dates.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Time (optional)
              </label>
              <input
                type="time"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editItineraryForm.data.time}
                onChange={(e) =>
                  editItineraryForm.setData("time", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Adjust the time if the schedule changed.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Title"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editItineraryForm.data.title}
                onChange={(e) =>
                  editItineraryForm.setData("title", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Update the name of the activity.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Location (optional)
              </label>
              <input
                placeholder="Location"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editItineraryForm.data.location}
                onChange={(e) =>
                  editItineraryForm.setData("location", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Adjust the meeting place or spot.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Notes (optional)
              </label>
              <textarea
                placeholder="Notes"
                rows={2}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editItineraryForm.data.notes}
                onChange={(e) =>
                  editItineraryForm.setData("notes", e.target.value)
                }
              ></textarea>
              <p className="mt-1 text-[11px] text-slate-500">
                Add any updated reminders or changes.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </BlueModal>

        {/* CHECKLIST EDIT MODAL (Task / Packing share same form) */}
        <BlueModal
          open={editChecklistOpen}
          title="Edit Checklist Item"
          onClose={() => setEditChecklistOpen(false)}
        >
          <form onSubmit={handleChecklistEdit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Title"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editChecklistForm.data.title}
                onChange={(e) =>
                  editChecklistForm.setData("title", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Change the name of the task or item.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Due Date (optional)
              </label>
              <input
                type="date"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editChecklistForm.data.due_date}
                onChange={(e) =>
                  editChecklistForm.setData("due_date", e.target.value)
                }
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Only needed for time-based tasks.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </BlueModal>

        {/* ACCOMMODATION EDIT MODAL */}
        <BlueModal
          open={editAccommodationOpen}
          title="Edit Accommodation"
          onClose={() => setEditAccommodationOpen(false)}
        >
          <form onSubmit={handleAccommodationEdit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Accommodation name"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.name}
                onChange={(e) =>
                  editAccommodationForm.setData("name", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.type}
                onChange={(e) =>
                  editAccommodationForm.setData("type", e.target.value)
                }
              >
                <option value="">Select type</option>
                <option value="Hotel">Hotel</option>
                <option value="Hostel">Hostel</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Resort">Resort</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Location"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.location}
                onChange={(e) =>
                  editAccommodationForm.setData("location", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Check-in <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.check_in_date}
                onChange={(e) =>
                  editAccommodationForm.setData("check_in_date", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Check-out <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.check_out_date}
                onChange={(e) =>
                  editAccommodationForm.setData("check_out_date", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Price per Night (optional)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.price_per_night}
                onChange={(e) =>
                  editAccommodationForm.setData("price_per_night", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Address (optional)
              </label>
              <input
                placeholder="Address"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.address}
                onChange={(e) =>
                  editAccommodationForm.setData("address", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Phone (optional)
              </label>
              <input
                placeholder="Phone number"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.phone}
                onChange={(e) =>
                  editAccommodationForm.setData("phone", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email (optional)
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.email}
                onChange={(e) =>
                  editAccommodationForm.setData("email", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Website (optional)
              </label>
              <input
                type="url"
                placeholder="Website URL"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.website}
                onChange={(e) =>
                  editAccommodationForm.setData("website", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Description (optional)
              </label>
              <textarea
                placeholder="Notes"
                rows={2}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.description}
                onChange={(e) =>
                  editAccommodationForm.setData("description", e.target.value)
                }
              ></textarea>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Booking Reference (optional)
              </label>
              <input
                placeholder="Booking ID"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.booking_reference}
                onChange={(e) =>
                  editAccommodationForm.setData(
                    "booking_reference",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Rating (optional)
              </label>
              <select
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.rating}
                onChange={(e) =>
                  editAccommodationForm.setData("rating", e.target.value)
                }
              >
                <option value="">Select rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status (optional)
              </label>
              <select
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editAccommodationForm.data.status}
                onChange={(e) =>
                  editAccommodationForm.setData("status", e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </BlueModal>

        {/* TRANSPORT EDIT MODAL */}
        <BlueModal
          open={editTransportOpen}
          title="Edit Transport"
          onClose={() => setEditTransportOpen(false)}
        >
          <form onSubmit={handleTransportEdit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.type}
                onChange={(e) =>
                  editTransportForm.setData("type", e.target.value)
                }
              >
                <option value="">Select type</option>
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Car Rental">Car Rental</option>
                <option value="Taxi">Taxi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Provider (optional)
              </label>
              <input
                placeholder="Provider name"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.provider}
                onChange={(e) =>
                  editTransportForm.setData("provider", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                From <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="From location"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.from_location}
                onChange={(e) =>
                  editTransportForm.setData("from_location", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                To <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="To location"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.to_location}
                onChange={(e) =>
                  editTransportForm.setData("to_location", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Departure <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.departure_time}
                onChange={(e) =>
                  editTransportForm.setData("departure_time", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Arrival (optional)
              </label>
              <input
                type="datetime-local"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.arrival_time}
                onChange={(e) =>
                  editTransportForm.setData("arrival_time", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Duration Hours (optional)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="0.0"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.duration_hours}
                onChange={(e) =>
                  editTransportForm.setData("duration_hours", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Cost (optional)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.cost}
                onChange={(e) =>
                  editTransportForm.setData("cost", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Booking Reference (optional)
              </label>
              <input
                placeholder="Booking ID"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.booking_reference}
                onChange={(e) =>
                  editTransportForm.setData("booking_reference", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Confirmation Number (optional)
              </label>
              <input
                placeholder="Confirmation #"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.confirmation_number}
                onChange={(e) =>
                  editTransportForm.setData(
                    "confirmation_number",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Number of Seats (optional)
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.seats}
                onChange={(e) =>
                  editTransportForm.setData("seats", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Notes (optional)
              </label>
              <textarea
                placeholder="Notes"
                rows={2}
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.notes}
                onChange={(e) =>
                  editTransportForm.setData("notes", e.target.value)
                }
              ></textarea>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status (optional)
              </label>
              <select
                className="w-full border border-blue-300 bg-blue-50 text-slate-900 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                value={editTransportForm.data.status}
                onChange={(e) =>
                  editTransportForm.setData("status", e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </BlueModal>
      </div>
    </div>
  );
}
