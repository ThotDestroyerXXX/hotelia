import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  pgEnum,
  index,
  date,
  integer,
  time,
  primaryKey,
  unique,
  check,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["customer", "host", "admin"]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "passport",
  "driver_license",
  "national_id",
  "government_id",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "house",
  "villa",
  "condo",
  "townhouse",
  "cottage",
  "bungalow",
  "cabin",
  "loft",
  "guesthouse",
  "hotel",
  "hostel",
  "resort",
  "bnb",
  "other",
]);

export const roomTypeEnum = pgEnum("room_type", [
  "entire_place",
  "private_room",
  "shared_room",
  "hotel_room",
]);

export const cancellationPolicyEnum = pgEnum("cancellation_policy", [
  "flexible",
  "moderate",
  "strict",
  "super_strict_30",
  "super_strict_60",
  "non_refundable",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "awaiting_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "completed",
  "cancelled_by_guest",
  "cancelled_by_host",
  "cancelled_by_admin",
  "rejected",
]);

export const reviewTypeEnum = pgEnum("review_type", [
  "guest_to_host",
  "host_to_guest",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "credit_card",
  "debit_card",
  "paypal",
  "apple_pay",
  "google_pay",
  "bank_transfer",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "booking_payment",
  "refund",
  "partial_refund",
  "payout",
  "service_fee",
  "cleaning_fee",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "cancelled",
]);

export const payoutMethodEnum = pgEnum("payout_method", [
  "bank_transfer",
  "paypal",
  "stripe",
  "wire_transfer",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);

export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "archived",
  "closed",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "booking_request",
  "booking_confirmed",
  "booking_cancelled",
  "new_message",
  "review_received",
  "payment_received",
  "payout_processed",
  "listing_approved",
  "listing_rejected",
  "price_drop",
  "special_offer",
  "reminder",
]);

export const entityTypeEnum = pgEnum("entity_type", [
  "booking",
  "message",
  "review",
  "property",
  "user",
  "payment",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const ticketCategoryEnum = pgEnum("ticket_category", [
  "booking_issue",
  "payment_issue",
  "property_issue",
  "account_issue",
  "technical_issue",
  "refund_request",
  "cancellation",
  "safety_concern",
  "other",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "waiting_customer",
  "resolved",
  "closed",
]);

export const senderTypeEnum = pgEnum("sender_type", [
  "user",
  "support_agent",
  "system",
]);

export const ruleTypeEnum = pgEnum("rule_type", [
  "pets_allowed",
  "smoking_allowed",
  "events_allowed",
  "children_allowed",
  "parties_allowed",
  "commercial_photography",
]);

export const amenityCategoryEnum = pgEnum("amenity_category", [
  "basic",
  "safety",
  "features",
  "accessibility",
]);

export const user = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    phoneNumber: text("phone_number").unique(),
    phoneNumberVerified: boolean("phone_number_verified"),
    role: text("role"),
    dateOfBirth: date("date_of_birth"),
    bio: text("bio"),
    isActive: boolean("is_active").default(true).notNull(),
    languagePreference: text("language_preference").default("en").notNull(),
    currencyPreference: text("currency_preference").default("USD").notNull(),
    emergencyContactName: text("emergency_contact_name"),
    emergencyContactPhone: text("emergency_contact_phone"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
  },
  (table) => [
    index("user_email_idx").on(table.email),
    index("user_is_active_idx").on(table.isActive),
  ]
);

export const session = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const userVerificationDocument = pgTable("user_verification_documents", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  documentType: documentTypeEnum("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  verificationStatus: verificationStatusEnum("verification_status")
    .default("pending")
    .notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
});

export const property = pgTable(
  "properties",
  {
    id: text("id").primaryKey(),
    hostId: text("host_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    propertyType: propertyTypeEnum("property_type").notNull(),
    roomType: roomTypeEnum("room_type").notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    state: text("state"),
    country: text("country").notNull(),
    postalCode: text("postal_code"),
    latitude: decimal("latitude"),
    longitude: decimal("longitude"),
    maxGuests: integer("max_guests").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    beds: integer("beds").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    squareFeet: integer("square_feet"),
    pricePerNight: decimal("price_per_night").notNull(),
    cleaningFee: decimal("cleaning_fee", { mode: "number" }).default(0),
    securityDeposit: decimal("security_deposit", { mode: "number" }).default(0),
    serviceFeePercentage: decimal("service_fee_percentage", {
      mode: "number",
    }).default(14),
    minimumNights: integer("minimum_nights").default(1),
    maximumNights: integer("maximum_nights").default(365),
    instantBooking: boolean("instant_booking").default(false),
    cancellationPolicy: cancellationPolicyEnum("cancellation_policy").default(
      "moderate"
    ),
    checkInTime: time("check_in_time").default("15:00"),
    checkOutTime: time("check_out_time").default("11:00"),
    checkInInstructions: text("check_in_instructions"),
    houseManual: text("house_manual"),
    wifiName: text("wifi_name"),
    wifiPassword: text("wifi_password"),
    isActive: boolean("is_active").default(true),
    isApproved: boolean("is_approved").default(false),
    approvalDate: timestamp("approval_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    check("price_per_night_non_negative", sql`${table.pricePerNight} >= 0`),
    check("cleaning_fee_non_negative", sql`${table.cleaningFee} >= 0`),
    check("security_deposit_non_negative", sql`${table.securityDeposit} >= 0`),
    check(
      "service_fee_percentage_non_negative",
      sql`${table.serviceFeePercentage} >= 0`
    ),
    check("minimum_nights_positive", sql`${table.minimumNights} > 0`),
    check(
      "maximum_nights_positive",
      sql`${table.maximumNights} >= ${table.minimumNights}`
    ),
    check("max_guests_positive", sql`${table.maxGuests} > 0`),
    check("bedrooms_non_negative", sql`${table.bedrooms} >= 0`),
    check("beds_non_negative", sql`${table.beds} >= 0`),
    check("bathrooms_non_negative", sql`${table.bathrooms} >= 0`),

    index("idx_properties_host").on(table.hostId),
    index("idx_properties_location").on(table.city, table.country),
    index("idx_properties_active").on(table.isActive, table.isApproved),
    index("idx_properties_type").on(table.propertyType, table.roomType),
    index("idx_properties_price").on(table.pricePerNight),
    index("idx_properties_coords").on(table.latitude, table.longitude),
  ]
);

export const propertyPhoto = pgTable(
  "property_photos",
  {
    id: text("id").primaryKey(),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    photoUrl: text("photo_url").notNull(),
    caption: text("caption"),
    displayOrder: integer("display_order").notNull(),
    isCover: boolean("is_cover").default(false),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
  },
  (table) => [
    check("display_order_non_negative", sql`${table.displayOrder} >= 0`),
  ]
);

export const amenity = pgTable("amenities", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  category: amenityCategoryEnum("category").notNull(),
});

export const propertyAmenity = pgTable(
  "property_amenities",
  {
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    amenityId: integer("amenity_id")
      .notNull()
      .references(() => amenity.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.propertyId, table.amenityId] })]
);

export const propertyRule = pgTable("property_rules", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  propertyId: text("property_id")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  ruleType: ruleTypeEnum("rule_type").notNull(),
  isAllowed: boolean("is_allowed").notNull(),
  additionalInfo: text("additional_info"),
});

export const propertyAvailability = pgTable(
  "property_availability",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    isAvailable: boolean("is_available").default(true),
    priceOverride: decimal("price_override", { mode: "number" }),
    minimumNightsOverride: integer("minimum_nights_override"),
    notes: text("notes"),
  },
  (t) => [
    unique().on(t.propertyId, t.date),
    check("price_override_non_negative", sql`${t.priceOverride} >= 0`),
    check(
      "minimum_nights_override_positive",
      sql`${t.minimumNightsOverride} > 0`
    ),

    index("idx_property_availability_date").on(t.propertyId, t.date),
    index("idx_property_availability_available").on(t.isAvailable),
  ]
);

export const booking = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "restrict" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    checkInDate: date("check_in_date").notNull(),
    checkOutDate: date("check_out_date").notNull(),
    numberOfGuests: integer("number_of_guests").notNull(),
    numberOfAdults: integer("number_of_adults").notNull(),
    numberOfChildren: integer("number_of_children").default(0),
    numberOfInfants: integer("number_of_infants").default(0),
    numberOfPets: integer("number_of_pets").default(0),
    totalNights: integer("total_nights").notNull(),
    pricePerNight: decimal("price_per_night").notNull(),
    cleaningFee: decimal("cleaning_fee", { mode: "number" }).default(0),
    serviceFee: decimal("service_fee", { mode: "number" }).notNull(),
    securityDeposit: decimal("security_deposit", { mode: "number" }).default(0),
    totalPrice: decimal("total_price", { mode: "number" }).notNull(),
    bookingStatus: bookingStatusEnum("booking_status").default("pending"),
    specialRequests: text("special_requests"),
    cancellationReason: text("cancellation_reason"),
    cancelledAt: timestamp("cancelled_at"),
    cancelledBy: text("cancelled_by").references(() => user.id),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    check("number_of_guests_positive", sql`${table.numberOfGuests} > 0`),
    check("number_of_adults_positive", sql`${table.numberOfAdults} > 0`),
    check(
      "number_of_children_non_negative",
      sql`${table.numberOfChildren} >= 0`
    ),
    check("number_of_infants_non_negative", sql`${table.numberOfInfants} >= 0`),
    check("number_of_pets_non_negative", sql`${table.numberOfPets} >= 0`),
    check("total_nights_positive", sql`${table.totalNights} > 0`),
    check("price_per_night_non_negative", sql`${table.pricePerNight} >= 0`),
    check("cleaning_fee_non_negative", sql`${table.cleaningFee} >= 0`),
    check("service_fee_non_negative", sql`${table.serviceFee} >= 0`),
    check("security_deposit_non_negative", sql`${table.securityDeposit} >= 0`),
    check("total_price_non_negative", sql`${table.totalPrice} >= 0`),
    check(
      "check_out_after_check_in",
      sql`${table.checkOutDate} > ${table.checkInDate}`
    ),

    index("idx_bookings_property").on(table.propertyId),
    index("idx_bookings_guest").on(table.guestId),
    index("idx_bookings_dates").on(table.checkInDate, table.checkOutDate),
    index("idx_bookings_status").on(table.bookingStatus),
    index("idx_bookings_created").on(table.createdAt),
  ]
);

export const review = pgTable(
  "review",
  {
    id: text("id").primaryKey(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => booking.id, { onDelete: "cascade" }),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    reviewerId: text("reviewer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    revieweeId: text("reviewee_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reviewType: reviewTypeEnum("review_type").notNull(),
    ratingOverall: decimal("rating_overall").notNull(),
    ratingCleanliness: decimal("rating_cleanliness"),
    ratingAccuracy: decimal("rating_accuracy"),
    ratingCheckin: decimal("rating_checkin"),
    ratingCommunication: decimal("rating_communication"),
    ratingLocation: decimal("rating_location"),
    ratingValue: decimal("rating_value"),
    comment: text("comment"),
    isPublic: boolean("is_public").default(true),
    hostResponse: text("host_response"),
    hostResponseAt: timestamp("host_response_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("rating_overall_range", sql`${table.ratingOverall} BETWEEN 1 AND 5`),
    check(
      "rating_cleanliness_range",
      sql`${table.ratingCleanliness} BETWEEN 1 AND 5`
    ),
    check(
      "rating_accuracy_range",
      sql`${table.ratingAccuracy} BETWEEN 1 AND 5`
    ),
    check("rating_checkin_range", sql`${table.ratingCheckin} BETWEEN 1 AND 5`),
    check(
      "rating_communication_range",
      sql`${table.ratingCommunication} BETWEEN 1 AND 5`
    ),
    check(
      "rating_location_range",
      sql`${table.ratingLocation} BETWEEN 1 AND 5`
    ),
    check("rating_value_range", sql`${table.ratingValue} BETWEEN 1 AND 5`),

    index("idx_reviews_property").on(table.propertyId),
    index("idx_reviews_reviewee").on(table.revieweeId),
    index("idx_reviews_type").on(table.reviewType),
  ]
);

export const paymentMethod = pgTable(
  "payment_methods",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    paymentType: paymentTypeEnum("payment_type").notNull(),
    cardLastFour: text("card_last_four"),
    cardBrand: text("card_brand"),
    cardExpiryMonth: integer("card_expiry_month"),
    cardExpiryYear: integer("card_expiry_year"),
    billingAddress: text("billing_address"),
    billingPostalCode: text("billing_postal_code"),
    isDefault: boolean("is_default").default(false),
    stripePaymentMethodId: text("stripe_payment_method_id"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "card_expiry_month_range",
      sql`${table.cardExpiryMonth} BETWEEN 1 AND 12`
    ),
  ]
);

export const transaction = pgTable(
  "transactions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => booking.id, { onDelete: "restrict" }),
    payerId: text("payer_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    payeeId: text("payee_id").references(() => user.id, {
      onDelete: "restrict",
    }),
    paymentMethodId: integer("payment_method_id").references(
      () => paymentMethod.id
    ),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    amount: decimal("amount").notNull(),
    currency: text("currency").default("USD"),
    status: transactionStatusEnum("status").default("pending"),
    stripeTransactionId: text("stripe_transaction_id"),
    paymentGateway: text("payment_gateway").default("stripe"),
    failureReason: text("failure_reason"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("amount_non_negative", sql`${table.amount} >= 0`),
    index("idx_transactions_booking").on(table.bookingId),
    index("idx_transactions_payer").on(table.payerId),
    index("idx_transactions_status").on(table.status),
  ]
);

export const payout = pgTable(
  "payouts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    hostId: text("host_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    bookingId: text("booking_id")
      .notNull()
      .references(() => booking.id, { onDelete: "restrict" }),
    amount: decimal("amount", { mode: "number" }).notNull(),
    currency: text("currency").default("USD"),
    status: payoutStatusEnum("status").default("pending"),
    payoutMethod: payoutMethodEnum("payout_method").notNull(),
    payoutAccountInfo: text("payout_account_info"),
    stripePayoutId: text("stripe_payout_id"),
    scheduledDate: date("scheduled_date"),
    completedAt: timestamp("completed_at"),
    failureReason: text("failure_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [check("amount_non_negative", sql`${table.amount} >= 0`)]
);

export const conversation = pgTable(
  "conversations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    hostId: text("host_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    bookingId: text("booking_id").references(() => booking.id, {
      onDelete: "set null",
    }),
    status: conversationStatusEnum("status").default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [unique().on(table.propertyId, table.guestId, table.hostId)]
);

export const message = pgTable(
  "messages",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    messageText: text("message_text").notNull(),
    isRead: boolean("is_read").default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_messages_conversation").on(table.conversationId),
    index("idx_messages_sender").on(table.senderId),
    index("idx_messages_read").on(table.isRead),
  ]
);

export const wishlist = pgTable("wishlists", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const wishlistProperty = pgTable(
  "wishlist_properties",
  {
    wishlistId: integer("wishlist_id")
      .notNull()
      .references(() => wishlist.id, { onDelete: "cascade" }),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "cascade" }),
    notes: text("notes"),
    addedAt: timestamp("added_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.wishlistId, table.propertyId] })]
);

export const notification = pgTable(
  "notifications",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    notificationType: notificationTypeEnum("notification_type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    relatedEntityType: entityTypeEnum("related_entity_type"),
    relatedEntityId: integer("related_entity_id"),
    actionUrl: text("action_url"),
    isRead: boolean("is_read").default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_notifications_user").on(table.userId, table.isRead),
    index("idx_notifications_created").on(table.createdAt),
  ]
);

export const coupon = pgTable(
  "coupons",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: text("code").notNull().unique(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: decimal("discount_value").notNull(),
    minimumSpend: decimal("minimum_spend"),
    maximumDiscount: decimal("maximum_discount"),
    validFrom: timestamp("valid_from").notNull(),
    validUntil: timestamp("valid_until").notNull(),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").default(0),
    applicableToPropertyId: text("applicable_to_property_id").references(
      () => property.id,
      { onDelete: "cascade" }
    ),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("discount_value_positive", sql`${table.discountValue} > 0`),
    check("minimum_spend_non_negative", sql`${table.minimumSpend} >= 0`),
    check("maximum_discount_non_negative", sql`${table.maximumDiscount} >= 0`),
    check("usage_limit_positive", sql`${table.usageLimit} > 0`),
    check("usage_count_non_negative", sql`${table.usageCount} >= 0`),
    check(
      "valid_until_after_valid_from",
      sql`${table.validUntil} > ${table.validFrom}`
    ),
  ]
);

export const bookingCoupon = pgTable(
  "booking_coupons",
  {
    bookingId: text("booking_id")
      .notNull()
      .references(() => booking.id, { onDelete: "cascade" }),
    couponId: integer("coupon_id")
      .notNull()
      .references(() => coupon.id, { onDelete: "restrict" }),
    discountApplied: decimal("discount_applied").notNull(),
    appliedAt: timestamp("applied_at").defaultNow(),
  },
  (table) => [
    check("discount_applied_non_negative", sql`${table.discountApplied} >= 0`),
    primaryKey({ columns: [table.bookingId, table.couponId] }),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
