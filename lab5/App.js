import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
	const [exams, setExams] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [randomLocations, setRandomLocations] = useState([]);

	useEffect(() => {
		// Fetch exam schedule from an API or local storage
		const fetchedExams = [
			{ date: '2024-02-20', subject: 'Math' },
			{ date: '2024-02-22', subject: 'Science' },
			{ date: '2024-02-25', subject: 'History' },
		];
		setExams(fetchedExams);

		// Generate random locations for each exam date
		const locations = fetchedExams.map((exam) => ({
			date: exam.date,
			latitude: getRandomCoordinate(-90, 90), // Random latitude between -90 and 90
			longitude: getRandomCoordinate(-180, 180), // Random longitude between -180 and 180
		}));
		setRandomLocations(locations);
	}, []);

	useEffect(() => {
		if (selectedDate) {
			const exam = exams.find((exam) => exam.date === selectedDate);
			if (exam) {
				scheduleNotification(exam);
			}
		}
	}, [selectedDate]);

	const scheduleNotification = async (exam) => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: 'Upcoming Exam',
				body: `You have an exam for ${exam.subject} tomorrow!`,
			},
			trigger: {
				seconds: 5, // for testing, change this to the appropriate time
			},
		});
	};

	const handleDayPress = (day) => {
		setSelectedDate(day.dateString);
	};
	// Function to generate a random number between min and max (inclusive)
	function getRandomCoordinate(min, max) {
		return Math.random() * (max - min) + min;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Exam Schedule</Text>
			<Calendar
				onDayPress={handleDayPress}
				markedDates={{
					[selectedDate]: { selected: true, selectedColor: 'blue' },
				}}
			/>
			<Text style={styles.selectedDate}>
				Selected Date: {selectedDate ? selectedDate : 'Please select a date'}
			</Text>
			<Text style={styles.examListHeader}>Exams for selected date:</Text>
			{exams.map((exam, index) => (
				<Text key={index} style={styles.exam}>
					{exam.date} - {exam.subject}
				</Text>
			))}
			<MapView
				style={styles.map}
				region={{
					latitude: 0, // Default center
					longitude: 0, // Default center
					latitudeDelta: 90, // Zoom level
					longitudeDelta: 180, // Zoom level
				}}
			>
				{randomLocations.map((location, index) => (
					<Marker
						key={index}
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
						title={`Random Location ${index + 1}`}
					/>
				))}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	selectedDate: {
		marginTop: 20,
		marginBottom: 10,
	},
	examListHeader: {
		marginTop: 20,
		marginBottom: 10,
		fontSize: 18,
		fontWeight: 'bold',
	},
	exam: {
		fontSize: 16,
		marginBottom: 5,
	},
	map: {
		width: '100%',
		height: 300, // Adjust height as needed
		marginTop: 20,
	},
});
