$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyAnGovc3Xy_WRhaRY763RHKjCrAQyOHEik",
        authDomain: "train-ecf25.firebaseapp.com",
        databaseURL: "https://train-ecf25.firebaseio.com",
        projectId: "train-ecf25",
        storageBucket: "train-ecf25.appspot.com",
        messagingSenderId: "688251495690",
        appId: "1:688251495690:web:6c5801adde8e90da"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let database = firebase.database();

    $("#save").on("click", event => {
        event.preventDefault();
        let trainName = $("#train-input")
            .val()
            .trim();
        let destination = $("#destination-input")
            .val()
            .trim();
        let firstTrainTime = $("#train-time-input")
            .val()
            .trim();
        let frequency = $("#frequency-input")
            .val()
            .trim();

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });
    });
    database.ref().on("child_added", snapshot => {
        let data = snapshot.val();
        var trainOne = data.firstTrainTime;
        var howOften = data.frequency;
        var firstTrainDeparture = moment(trainOne, "HH:mm").subtract(1, "years");
        var nextOne = moment().diff(moment(firstTrainDeparture), "minutes");
        var timeRemaining = nextOne % +howOften;
        var minutesAway = +howOften - timeRemaining;
        var nextTrain = moment()
            .add(minutesAway, "minutes")
            .format("hh:mm A");

        let schedule = `
              <tr>
                  <th scope="row">${data.trainName}</th>
                  <td>${data.destination}</td>
                  <td>${howOften}</td>
                  <td>${nextTrain}</td>
                  <td>${minutesAway}</td>
                </tr>`;

        $("#train-section").append(schedule);
    });
});