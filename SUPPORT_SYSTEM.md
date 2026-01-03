# 🎯 Advanced Support System Documentation

## Overview
A comprehensive support ticket management system for admins to handle customer queries efficiently.

## ✨ Key Features

### 1. **Ticket Management**
- View all support tickets with filtering
- Filter by status (Open, In Progress, Resolved, Closed)
- Filter by priority (Low, Medium, High, Urgent)
- Filter by category (Technical, Billing, General, Complaint)
- Search tickets by subject or message content

### 2. **Reply System**
- Admin can reply to tickets
- Replies are stored in conversation thread
- Automatic status update to "In Progress" when admin replies
- User notifications when admin replies

### 3. **Status Management**
- **Open** - New ticket, not yet addressed
- **In Progress** - Admin is working on it
- **Resolved** - Issue solved (requires admin reply first)
- **Closed** - Ticket closed (requires admin reply first)

**Important**: Tickets can only be marked as "Resolved" or "Closed" after admin has replied at least once.

### 4. **Priority Management**
- **Low** - Non-urgent issues
- **Medium** - Standard priority
- **High** - Important issues
- **Urgent** - Critical issues requiring immediate attention

### 5. **Statistics Dashboard**
- Total tickets count
- Open tickets count
- In-progress tickets count
- Resolved tickets count
- Closed tickets count
- Urgent tickets count

## 🔧 Backend API Endpoints

### Get All Tickets (Admin)
```
GET /api/support/admin/tickets
Query Parameters:
  - status: Filter by status
  - priority: Filter by priority
  - category: Filter by category
  - search: Search in subject/message
```

### Get Ticket Statistics
```
GET /api/support/admin/stats
Returns: { total, open, inProgress, resolved, closed, urgent }
```

### Reply to Ticket
```
POST /api/support/admin/tickets/:id/reply
Body: { message: string }
- Automatically sets status to "in-progress" if it was "open"
- Creates notification for user
```

### Update Ticket Status
```
PUT /api/support/admin/tickets/:id/status
Body: { status: 'open' | 'in-progress' | 'resolved' | 'closed' }
- Requires at least one admin reply before marking as resolved/closed
- Creates notification for user
```

### Update Ticket Priority
```
PUT /api/support/admin/tickets/:id/priority
Body: { priority: 'low' | 'medium' | 'high' | 'urgent' }
```

### Get Single Ticket
```
GET /api/support/tickets/:id
- Returns full ticket details with replies
- Populates user information
```

## 🎨 UI Features

### Admin Support Page (`/admin/support`)

1. **Statistics Cards**
   - Visual overview of ticket metrics
   - Color-coded cards for different statuses
   - Real-time updates

2. **Filtering System**
   - Status dropdown filter
   - Priority dropdown filter
   - Category dropdown filter
   - Search input for text search

3. **Ticket List**
   - Clickable ticket cards
   - Shows subject, status, priority, category
   - Displays user name and creation date
   - Shows reply count
   - Highlights selected ticket

4. **Ticket Details Panel**
   - Full ticket information
   - User contact details
   - Original message
   - Conversation thread (all replies)
   - Priority selector
   - Status selector
   - Reply textarea
   - Send reply button

5. **Conversation Thread**
   - Shows all replies chronologically
   - Distinguishes admin vs user replies
   - Shows reply author and timestamp
   - Color-coded (admin replies in blue, user in gray)

## 🔐 Security Features

- All admin routes protected with `adminAuth` middleware
- Only admins can reply to tickets
- Only admins can change ticket status
- Status validation (cannot mark resolved/closed without reply)
- User can only see their own tickets

## 📊 Database Schema

### SupportTicket Model
```javascript
{
  userId: ObjectId (ref: User),
  subject: String,
  message: String,
  category: ['technical', 'billing', 'general', 'complaint'],
  status: ['open', 'in-progress', 'resolved', 'closed'],
  priority: ['low', 'medium', 'high', 'urgent'],
  replies: [{
    message: String,
    repliedBy: ObjectId (ref: User),
    repliedAt: Date,
    isAdmin: Boolean
  }],
  resolvedAt: Date,
  resolvedBy: ObjectId (ref: User),
  createdAt: Date
}
```

## 🔔 Notifications

- User receives notification when admin replies
- User receives notification when ticket status changes
- Admin dashboard shows urgent ticket count

## 🚀 Usage Flow

1. **User creates ticket** → Status: "Open"
2. **Admin views ticket** → Sees in ticket list
3. **Admin replies** → Status auto-updates to "In Progress"
4. **Admin can change priority** → Updates immediately
5. **Admin marks as resolved** → Only after replying
6. **User sees update** → Via notification

## 📝 Best Practices

1. **Always reply before resolving** - System enforces this
2. **Set appropriate priority** - Helps with ticket triage
3. **Use clear, helpful replies** - Better customer satisfaction
4. **Update status promptly** - Keeps users informed
5. **Monitor urgent tickets** - Check dashboard regularly

## 🎯 Future Enhancements

- Email notifications
- Ticket assignment to specific admins
- SLA tracking (response time, resolution time)
- Ticket templates for common issues
- File attachments in replies
- Internal notes (admin-only)
- Ticket merging
- Bulk actions

