<?php

$dbHost = 'localhost';
$dbPort = '5432';
$dbName = 'database_testing';
$dbUser = 'postgres';
$dbPassword = '1942';

try {
    $db = new PDO("pgsql:host=$dbHost;port=$dbPort;dbname=$dbName;user=$dbUser;password=$dbPassword");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Ошибка подключения к базе данных: ' . $e->getMessage());
}


try {
    $db->exec('CREATE TABLE IF NOT EXISTS kettles (
        id SERIAL PRIMARY KEY,
        brand TEXT,
        model TEXT,
        price INTEGER
    )');
} catch (PDOException $e) {
    die('Ошибка при создании таблицы: ' . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    $stmt = $db->query('SELECT * FROM kettles');
    $kettles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($kettles);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $kettleId = $_GET['id'];
    $stmt = $db->prepare('SELECT * FROM kettles WHERE id = ?');
    $stmt->execute([$kettleId]);
    $kettle = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($kettle) {
        echo json_encode($kettle);
    } else {
        echo json_encode(['message' => 'Чайник не найден']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $brand = $_POST['brand'];
    $model = $_POST['model'];
    $price = $_POST['price'];
    $stmt = $db->prepare('INSERT INTO kettles (brand, model, price) VALUES (?, ?, ?)');
    $stmt->execute([$brand, $model, $price]);
    $kettleId = $db->lastInsertId('kettles_id_seq');
    echo json_encode(['id' => $kettleId]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $putParams);
    $kettleId = $putParams['id'];
    $brand = $putParams['brand'];
    $model = $putParams['model'];
    $price = $putParams['price'];
    $stmt = $db->prepare('UPDATE kettles SET brand = ?, model = ?, price = ? WHERE id = ?');
    $stmt->execute([$brand, $model, $price, $kettleId]);
    echo json_encode(['success' => true]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $kettleId = $_GET['id'];
    $stmt = $db->prepare('DELETE FROM kettles WHERE id = ?');
    $stmt->execute([$kettleId]);
    echo json_encode(['success' => true]);
}
