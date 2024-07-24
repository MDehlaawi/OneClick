<?php
$servername = "localhost"; // Change if your MySQL server is not on localhost
$username = "root"; // Replace with your MySQL username
$password = "Mawaddah123"; // Replace with your MySQL password
$dbname = "OneClick"; // Database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve data from POST request
    $screenName = $_POST['screenName'];
    $ip = $_POST['ip'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO Screens (ScreenName, IP) VALUES (?, ?)");
    $stmt->bind_param("ss", $screenName, $ip);

    // Execute the query
    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
