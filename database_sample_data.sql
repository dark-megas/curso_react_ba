-- =============================================
-- DATOS DE EJEMPLO PARA EL PANEL DE ADMINISTRACIÓN
-- =============================================

-- Insertar productos de ejemplo
INSERT INTO public.products (nombre, descripcion, precio, avatar, categoria, stock, detalles) VALUES
('Alimento para Perros Premium', 'Alimento balanceado de alta calidad para perros adultos', 45.99, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119', 'Alimentos', 150, 'Ingredientes naturales, sin conservantes'),
('Juguete para Gatos', 'Ratón de peluche con hierba gatera', 12.50, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f', 'Juguetes', 200, 'Material seguro y duradero'),
('Correa Retráctil', 'Correa extensible de 5 metros para paseos', 25.00, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1', 'Accesorios', 80, 'Mango ergonómico, sistema de freno'),
('Cama para Mascotas', 'Cama acolchada tamaño mediano', 65.00, 'https://images.unsplash.com/photo-1615751072497-5f5169febe17', 'Accesorios', 45, 'Lavable en máquina, material antialérgico'),
('Shampoo Natural', 'Shampoo hipoalergénico para mascotas', 18.75, 'https://images.unsplash.com/photo-1603912699214-92627f304eb6', 'Higiene', 120, 'pH balanceado, aroma a lavanda'),
('Transportadora Mediana', 'Transportadora plástica resistente', 55.00, 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3', 'Accesorios', 35, 'Ventilación óptima, cierre seguro'),
('Comedero Doble', 'Set de comedero y bebedero de acero inoxidable', 22.50, 'https://images.unsplash.com/photo-1585664811087-47f65abbad64', 'Accesorios', 95, 'Antideslizante, fácil de limpiar'),
('Arena para Gatos', 'Arena aglutinante control de olores', 16.00, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'Higiene', 180, 'Bajo polvo, biodegradable');

-- Nota: Para crear pedidos de ejemplo, necesitas primero tener usuarios registrados
-- Los pedidos se crean desde la aplicación o manualmente con user_id válidos

-- Ejemplo de pedido (reemplaza 'USER_UUID_HERE' con un UUID real de auth.users):
-- INSERT INTO public.orders (user_id, status, total_amount) VALUES
-- ('USER_UUID_HERE', 'pending', 123.45);

-- Ejemplo de items de pedido (reemplaza ORDER_ID con el ID real del pedido):
-- INSERT INTO public.order_items (order_id, product_id, quantity, unit_price) VALUES
-- (ORDER_ID, 1, 2, 45.99),
-- (ORDER_ID, 3, 1, 25.00);

