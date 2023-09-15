import React from "react";
import {  render,getAllByTestId, queryByAltText,fireEvent, waitForElement, prettyDOM, getByText, queryByText, getByAltText, getByPlaceholderText } from "@testing-library/react";
import Application from "components/Application"; // Make sure the import is correct
import axios from "axios";
describe("Application", () => {
  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });
  it("loads data, cancels an interview, and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Find an existing booked appointment and select it for editing.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => {
      return getByText(appointment, "Archie Cohen");
    });
  
    // 4. Click the "Edit" button on that appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));
  
    // 5. Change the interview details, for example, the student's name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Edited Student Name" }
    });
  
    // 6. Select a different interviewer if needed.
    // Replace "Sylvia Palmer" with the desired interviewer's name.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    // 7. Click the "Save" button to save the edited appointment.
    fireEvent.click(getByText(appointment, "Save"));
  
    // 8. Check that the element with the text "SAVING" is displayed temporarily.
    await waitForElement(() => getByText(appointment, "SAVING"));
  
    // 9. Wait until the element with the text "Edited Student Name" is displayed.
    await waitForElement(() => getByText(appointment, "Edited Student Name"));
  
    // 10. Check that the DayListItem with the text "Monday" still has the same spots remaining.
    const day = getAllByTestId(container, "day").find(day => getByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Find an existing booked appointment and select it for editing.
    const appointments = getAllByTestId(container, "appointment");
    const appointmentToEdit = appointments.find(appointment => {
      // Check if the appointment contains the text "Archie Cohen" (or your specific appointment text).
      const appointmentText = getByText(appointment, "Archie Cohen", { exact: false, normalizeWhitespace: true });
      return appointmentText !== null;
    });
  
    // Check if an appointment to edit was found.
    if (appointmentToEdit) {
      // 4. Click the "Edit" button on that appointment.
      fireEvent.click(getByAltText(appointmentToEdit, "Edit"));
  
      // 5. Change the interview details, for example, the student's name.
      fireEvent.change(getByPlaceholderText(appointmentToEdit, /enter student name/i), {
        target: { value: "Edited Student Name" }
      });
  
      // 6. Select a different interviewer if needed.
      // Replace "Sylvia Palmer" with the desired interviewer's name.
      fireEvent.click(getByAltText(appointmentToEdit, "Sylvia Palmer"));
  
      // 7. Mock a failure to save by rejecting the save request (e.g., a server error).
      // Replace the code below with your mocking logic as needed.
      jest.spyOn(window, "fetch").mockImplementationOnce(() => Promise.reject(new Error("Failed to save")));
  
      // 8. Click the "Save" button to save the edited appointment.
      fireEvent.click(getByText(appointmentToEdit, "Save"));
  
      // 9. Check that the element with the text "Error" is displayed, indicating a save error.
      expect(getByText(appointmentToEdit, "Error")).toBeInTheDocument();
      
      // 10. Check that the DayListItem with the text "Monday" still has the same spots remaining.
      const day = getAllByTestId(container, "day").find(day => getByText(day, "Monday"));
      expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    } else {
      // Handle the case where the appointment to edit was not found.
      throw new Error("Appointment to edit not found in the DOM.");
    }
  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Find an existing booked appointment and select it for deletion.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => {
      // Check if the appointment contains the text "Archie Cohen" (or your specific appointment text).
      const appointment = getByText(appointment, "Archie Cohen", { exact: false, normalizeWhitespace: true });
      return appointment !== null;
    });
  
    // Check if an appointment to delete was found.
    if (appointment) {
      // 4. Mock a failure to delete by rejecting the delete request (e.g., a server error).
      // Replace the code below with your mocking logic as needed.
      jest.spyOn(window, "fetch").mockImplementationOnce(() => Promise.reject(new Error("Failed to delete")));
  
      // 5. Click the "Delete" button on that appointment.
      fireEvent.click(getByAltText(appointment, "Delete"));
  
      // 6. Check that the confirmation message with the text "Are you sure you want to cancel this appointment?" is displayed.
      expect(getByText(appointment, "Are you sure you want to cancel this appointment?")).toBeInTheDocument();
  
      // 7. Click the "Confirm" button to delete the appointment.
      fireEvent.click(getByText(appointment, "Confirm"));
  
      // 8. Check that the element with the text "Error" is displayed, indicating a delete error.
      expect(getByText(appointment, "Error")).toBeInTheDocument();
  
      // 9. Check that the DayListItem with the text "Monday" still has the same spots remaining.
      const day = getAllByTestId(container, "day").find(day => getByText(day, "Monday"));
      expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    } else {
      // Handle the case where the appointment to delete was not found.
      throw new Error("Appointment to delete not found in the DOM.");
    }
  });
  
});