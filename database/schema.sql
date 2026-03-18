-- TicketLab SQL Server Database Schema

-- Create database
CREATE DATABASE TicketLab;
GO

USE TicketLab;
GO

-- Users table
CREATE TABLE [Users] (
    [user_id] INT PRIMARY KEY IDENTITY(1,1),
    [email] NVARCHAR(255) UNIQUE NOT NULL,
    [password_hash] NVARCHAR(255) NOT NULL,
    [name] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(50) DEFAULT 'user' CHECK ([role] IN ('user', 'admin')),
    [avatar] NVARCHAR(500),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_users_email ON [Users]([email]);
GO

-- Events table
CREATE TABLE [Events] (
    [event_id] INT PRIMARY KEY IDENTITY(1,1),
    [name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX),
    [image] NVARCHAR(500),
    [location] NVARCHAR(255),
    [category] NVARCHAR(50) CHECK ([category] IN ('music', 'festival', 'exhibition', 'sports')),
    [date] NVARCHAR(50),
    [price] INT,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);
GO

CREATE INDEX idx_events_category ON [Events]([category]);
GO

-- Ticket Types table
CREATE TABLE [TicketTypes] (
    [ticket_type_id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] INT NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [price] INT NOT NULL,
    [quantity_available] INT NOT NULL,
    [quantity_sold] INT DEFAULT 0,
    FOREIGN KEY ([event_id]) REFERENCES [Events]([event_id]) ON DELETE CASCADE
);
GO

CREATE INDEX idx_ticket_types_event ON [TicketTypes]([event_id]);
GO

-- Orders table
CREATE TABLE [Orders] (
    [order_id] INT PRIMARY KEY IDENTITY(1,1),
    [order_number] NVARCHAR(50) UNIQUE NOT NULL,
    [user_id] INT NOT NULL,
    [event_id] INT NOT NULL,
    [ticket_type_id] INT NOT NULL,
    [quantity] INT NOT NULL,
    [total_price] INT NOT NULL,
    [status] NVARCHAR(50) DEFAULT 'pending' CHECK ([status] IN ('pending', 'completed', 'cancelled')),
    [payment_method] NVARCHAR(100),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([user_id]) REFERENCES [Users]([user_id]) ON DELETE CASCADE,
    FOREIGN KEY ([event_id]) REFERENCES [Events]([event_id]),
    FOREIGN KEY ([ticket_type_id]) REFERENCES [TicketTypes]([ticket_type_id])
);
GO

CREATE INDEX idx_orders_user ON [Orders]([user_id]);
CREATE INDEX idx_orders_event ON [Orders]([event_id]);
CREATE INDEX idx_orders_status ON [Orders]([status]);
GO

-- User Tickets table
CREATE TABLE [UserTickets] (
    [user_ticket_id] INT PRIMARY KEY IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [order_id] INT NOT NULL,
    [event_id] INT NOT NULL,
    [ticket_type] NVARCHAR(100) NOT NULL,
    [quantity] INT NOT NULL,
    [total_price] INT NOT NULL,
    [purchase_date] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([user_id]) REFERENCES [Users]([user_id]) ON DELETE CASCADE,
    FOREIGN KEY ([order_id]) REFERENCES [Orders]([order_id]) ON DELETE CASCADE,
    FOREIGN KEY ([event_id]) REFERENCES [Events]([event_id])
);
GO

CREATE INDEX idx_user_tickets_user ON [UserTickets]([user_id]);
CREATE INDEX idx_user_tickets_order ON [UserTickets]([order_id]);
GO

-- Insert sample data
INSERT INTO [Users] ([email], [password_hash], [name], [role])
VALUES 
    ('test@example.com', '$2b$10$salt_hash_here', N'Lê Minh Quân', 'user'),
    ('admin@ticketlab.com', '$2b$10$salt_hash_here', N'Admin', 'admin');
GO

INSERT INTO [Events] ([name], [description], [image], [location], [category], [date], [price])
VALUES 
    (N'Taylor Swift Show', N'Liveshow Taylor Swift tại Việt Nam', '/images/event-liverpool.jpg', N'Sân vận động Mỹ Đình, Hà Nội', 'music', '26/04/2026', 500000),
    (N'Anh Trai Say Hi 2026', N'Chương trình âm nhạc Say Hi đặc biệt', '/images/event-anhtrai.jpg', N'Nhà hát Hòa Bình, TP.HCM', 'music', '30/05/2026', 800000),
    (N'All-Rounder Soobin', N'Liveshow All-Rounder của Soobin Hoàng Sơn', '/images/event-keinouui.jpg', N'Trung tâm Hội nghị Quốc gia', 'music', '29/11/2026', 800000),
    (N'Avenged Sevenfold Live', N'Đêm nhạc rock Avenged Sevenfold tại Việt Nam', '/images/event-avenged.jpg', N'Phú Thọ Arena, TP.HCM', 'music', '15/06/2026', 1500000),
    (N'Triển lãm tranh quốc tế', N'Triển lãm tranh quốc tế', '/images/event-trienlam.jpg', N'Bảo tàng Mỹ thuật Việt Nam', 'exhibition', '18/05/2026', 1800000),
    (N'Hẹn hè ở bảo tàng', N'Hẹn hè ở bảo tàng', '/images/event-museum.jpg', N'Bảo tàng Lịch sử Quốc gia', 'exhibition', '20/06/2026', 1200000);
GO

INSERT INTO [TicketTypes] ([event_id], [name], [price], [quantity_available])
VALUES 
    (1, N'VIP', 500000, 100),
    (1, N'Standard', 300000, 200),
    (1, N'Economy', 150000, 300),
    (2, N'VIP', 800000, 80),
    (2, N'Standard', 500000, 150),
    (2, N'Economy', 200000, 270),
    (3, N'VIP', 800000, 100),
    (3, N'Standard', 500000, 200),
    (3, N'Economy', 200000, 300),
    (4, N'VIP', 1500000, 60),
    (4, N'Standard', 1000000, 100),
    (4, N'Economy', 500000, 200),
    (5, N'VIP', 1800000, 50),
    (5, N'Standard', 1200000, 100),
    (5, N'Economy', 600000, 150),
    (6, N'VIP', 1200000, 40),
    (6, N'Standard', 800000, 80),
    (6, N'Economy', 400000, 100);
GO
