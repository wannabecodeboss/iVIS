<!-- Include Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>

<script>
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDRbU-AP9bY9QX1IGjBv_K-PQ6c9KOPQ_E",
        authDomain: "anpr-bg.firebaseapp.com",
        databaseURL: "https://anpr-bg-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "anpr-bg",
        storageBucket: "anpr-bg.appspot.com",
        messagingSenderId: "1059960578017",
        appId: "1:1059960578017:web:cd2c0158052e4e1388bca0"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Add Faculty Vehicle
    function addFaculty() {
        const name = document.getElementById("facultyName").value.trim();
        const plate = document.getElementById("facultyPlate").value.trim();

        if (!name || !plate) {
            alert("Please enter both name and number plate!");
            return;
        }

        db.ref("faculty/" + plate).set(name)
            .then(() => {
                console.log("Faculty vehicle added!");
                document.getElementById("facultyName").value = "";
                document.getElementById("facultyPlate").value = "";
            })
            .catch((error) => {
                console.error("Error adding faculty vehicle:", error);
            });
    }

    // Display Faculty Vehicles
    function displayFacultyVehicles() {
        const facultyTable = document.getElementById("facultyTable").getElementsByTagName('tbody')[0];
        facultyTable.innerHTML = "";

        db.ref("faculty").on("value", (snapshot) => {
            facultyTable.innerHTML = "";
            snapshot.forEach((childSnapshot) => {
                const name = childSnapshot.val();
                const plate = childSnapshot.key;

                const row = facultyTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                cell1.innerText = name;
                cell2.innerText = plate;

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete-btn";
                deleteBtn.onclick = () => deleteFaculty(plate);

                cell3.appendChild(deleteBtn);
            });
        });
    }

    function deleteFaculty(plate) {
        if (confirm(`Are you sure you want to delete ${plate}?`)) {
            db.ref("faculty/" + plate).remove()
                .then(() => {
                    console.log("Deleted successfully");
                })
                .catch((error) => {
                    console.error("Error deleting:", error);
                });
        }
    }

    // Display Outsider Vehicles - sorted latest first
    function displayOutsiderVehicles() {
        const outsidersTable = document.getElementById("outsidersTable").getElementsByTagName('tbody')[0];
        outsidersTable.innerHTML = "";

        db.ref("outsiders").once("value", (snapshot) => {
            let entries = [];

            snapshot.forEach((childSnapshot) => {
                const subEntries = childSnapshot.val(); // nested 1, 2, 3...
                Object.keys(subEntries).forEach((key) => {
                    const record = subEntries[key];
                    entries.push({
                        plate: record.plate || childSnapshot.key,
                        entry: record.entry || "Unknown",
                        exit: record.exit || "Not exited yet"
                    });
                });
            });

            // Sort by entry time (assuming HH:MM:SS format)
            entries.sort((a, b) => b.entry.localeCompare(a.entry));

            entries.forEach((record) => {
                const row = outsidersTable.insertRow();

                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                cell1.innerText = record.plate;
                cell2.innerText = record.entry;
                cell3.innerText = record.exit;
            });
        });
    }

    // Example usage: add outsider vehicle (optional for testing)
    function addOutsiderVehicle(plate, entryTime) {
        if (!plate || !entryTime) return;

        const newEntryRef = db.ref("outsiders/" + plate).push();
        newEntryRef.set({
            plate: plate,
            entry: entryTime,
            exit: null
        });
    }

    // Attach event listener to add button
    document.getElementById("addFacultyBtn").addEventListener("click", addFaculty);

    // Initial load
    displayFacultyVehicles();
    displayOutsiderVehicles();
</script>
