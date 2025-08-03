// Firestore composite indexes setup
// These indexes need to be created in Firebase Console for optimal query performance

export const REQUIRED_INDEXES = [
  {
    collection: "notes",
    fields: [
      { field: "branch", order: "ASCENDING" },
      { field: "semester", order: "ASCENDING" },
      { field: "subject", order: "ASCENDING" },
      { field: "timestamp", order: "DESCENDING" },
    ],
  },
  {
    collection: "pyqs",
    fields: [
      { field: "branch", order: "ASCENDING" },
      { field: "semester", order: "ASCENDING" },
      { field: "subject", order: "ASCENDING" },
      { field: "year", order: "DESCENDING" },
    ],
  },
  {
    collection: "timetables",
    fields: [
      { field: "branch", order: "ASCENDING" },
      { field: "semester", order: "ASCENDING" },
      { field: "uploadedAt", order: "DESCENDING" },
    ],
  },
  {
    collection: "announcements",
    fields: [
      { field: "type", order: "ASCENDING" },
      { field: "isActive", order: "ASCENDING" },
      { field: "timestamp", order: "DESCENDING" },
    ],
  },
  {
    collection: "requests",
    fields: [
      { field: "status", order: "ASCENDING" },
      { field: "branch", order: "ASCENDING" },
      { field: "requestedAt", order: "DESCENDING" },
    ],
  },
  {
    collection: "study_materials",
    fields: [
      { field: "branch", order: "ASCENDING" },
      { field: "semester", order: "ASCENDING" },
      { field: "type", order: "ASCENDING" },
      { field: "uploadedAt", order: "DESCENDING" },
    ],
  },
]

console.log("📊 Required Firestore Composite Indexes:")
console.log("Copy these index configurations to your Firebase Console > Firestore > Indexes")
console.log("\n", JSON.stringify(REQUIRED_INDEXES, null, 2))
