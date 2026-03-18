-- Create database if not exists
USE ticketlab;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(MAX) NOT NULL,
    role NVARCHAR(50) DEFAULT 'user',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    event_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    location NVARCHAR(255),
    category NVARCHAR(100),
    event_date NVARCHAR(50),
    price INT,
    image NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create TicketTypes table
CREATE TABLE IF NOT EXISTS ticket_types (
    ticket_type_id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT NOT NULL,
    name NVARCHAR(100),
    price INT,
    quantity INT,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    ticket_type_id INT,
    quantity INT,
    total_price INT,
    payment_method NVARCHAR(100),
    status NVARCHAR(50) DEFAULT 'completed',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id)
);

-- Create Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    ticket_type_id INT,
    ticket_code NVARCHAR(100) UNIQUE,
    status NVARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id)
);

-- Insert sample admin user
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@ticketlab.com')
BEGIN
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin User', 'admin@ticketlab.com', '$2a$10$3zIqwNrXXm02bJJ7rZaXeOg9VL0qr5YqqgNQn7LPYIgMEPrXKV1Ny', 'admin');
END

-- Insert sample event
IF NOT EXISTS (SELECT 1 FROM events WHERE name = 'Concert 2026')
BEGIN
    INSERT INTO events (name, description, location, category, event_date, price, image)
    VALUES ('Concert 2026', 'Amazing concert experience', 'Concert Hall', 'music', '15/07/2026', 500000, '/images/event-1.jpg');
    
    -- Insert ticket types for the event
    DECLARE @event_id INT = SCOPE_IDENTITY();
    INSERT INTO ticket_types (event_id, name, price, quantity)
    VALUES 
        (@event_id, 'VIP', 500000, 100),
        (@event_id, 'Standard', 300000, 200);
END
