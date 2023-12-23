import { Model, Document } from "mongoose";

// Define the structure of MonthData
interface MonthData {
  month: string;  // Month and year as a formatted string (e.g., "Nov 2022")
  count: number;  // Number of documents created in a specific month
}

// Function to generate data for the last twelve months
export async function generateLasttweleveMonthsData<T extends Document>(
  model: Model<T>
): Promise<{ lastTweleveMonths: MonthData[] }> {
  const lastTweleveMonths: MonthData[] = [];

  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Increment current date by 1 day

  // Iterate for the last 12 months
  for (let i = 11; i >= 0; i--) {
    // Calculate the end date for the current month
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );

    // Calculate the start date for the current month
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    // Format the month and year as a string
    const monthYear = endDate.toLocaleDateString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Count the number of documents created within the current month
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Push the MonthData object to the result array
    lastTweleveMonths.push({ month: monthYear, count });
  }

  // Return the array of last twelve months' data
  return { lastTweleveMonths };
}
