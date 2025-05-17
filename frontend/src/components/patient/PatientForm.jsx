import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaHeartbeat,
  FaTint,
  FaCalendarAlt,
  FaVenusMars,
  FaBaby,
  FaNotesMedical
} from "react-icons/fa";
import SymptomImageUpload from "./SymptomImageUpload";
import { useAppContext } from "../../context/AppContext";

const FormContainer = styled.form`
  background-color: var(--neutral-100);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  animation: slideInUp var(--transition-normal);
`;

const FormTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: var(--space-5);
  text-align: center;
`;

const FormSection = styled.div`
  margin-bottom: var(--space-5);
`;

const SectionTitle = styled.h3`
  color: var(--neutral-700);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--neutral-300);
`;

const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
`;

const FormGroup = styled.div`
  flex: ${(props) => (props.fullWidth ? "1 0 100%" : "1")};
  min-width: ${(props) => (props.fullWidth ? "100%" : "250px")};
  margin-bottom: var(--space-4);
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--space-2);
  color: var(--neutral-700);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--neutral-400);
  border-radius: var(--border-radius-md);
  transition: border-color var(--transition-fast),
    box-shadow var(--transition-fast);

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.2);
    outline: none;
  }

  /* Remove spinner arrows from number inputs */
  &[type="number"] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--neutral-400);
  border-radius: var(--border-radius-md);
  background-color: white;
  transition: border-color var(--transition-fast),
    box-shadow var(--transition-fast);

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.2);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: var(--space-3);
  border: 1px solid var(--neutral-400);
  border-radius: var(--border-radius-md);
  resize: vertical;
  transition: border-color var(--transition-fast),
    box-shadow var(--transition-fast);

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.2);
    outline: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: var(--space-4);
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast),
    transform var(--transition-fast);
  display: block;
  margin: var(--space-4) auto 0;

  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BPInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const BPInput = styled(Input)`
  flex: 1;
`;

const BPSeparator = styled.span`
  font-weight: bold;
  color: var(--neutral-700);
`;

const PatientForm = () => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    temperature: "",
    symptoms: "",
    pregnant: "no",
    systolicBP: "",
    diastolicBP: "",
    sugarLevel: "",
    symptomImage: null,
  });

  // Update pregnancy status when gender changes
  useEffect(() => {
    if (formData.gender === "male") {
      setFormData((prev) => ({ ...prev, pregnant: "no" }));
    }
  }, [formData.gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageFile) => {
    setFormData((prev) => ({ ...prev, symptomImage: imageFile }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading state
    dispatch({ type: "SET_LOADING", payload: true });

    // Combine systolic and diastolic into blood pressure format
    const bloodPressure = `${formData.systolicBP}/${formData.diastolicBP}`;

    try {
      // Create form data for multipart/form-data submission
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("age", formData.age);
      submitData.append("gender", formData.gender);
      submitData.append("location", formData.location);
      submitData.append("temperature_f", formData.temperature);
      submitData.append("pregnancy_status", formData.pregnant);
      submitData.append("blood_pressure", bloodPressure);
      submitData.append("blood_glucose", formData.sugarLevel);
      submitData.append("symptoms", formData.symptoms);

      // Append image if it exists
      if (formData.symptomImage) {
        submitData.append("image", formData.symptomImage);
      }

      // Send data to backend
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        // Save patient data with combined blood pressure
        const patientDataWithBP = {
          ...formData,
          bloodPressure,
        };

        dispatch({ type: "SET_PATIENT_DATA", payload: patientDataWithBP });
        dispatch({ type: "SET_DIAGNOSIS", payload: result.diagnosis });
      } else {
        throw new Error(result.error || "Failed to submit patient data");
      }
    } catch (error) {
      console.error("Error submitting patient data:", error);

      // Fallback to mock diagnosis for testing if API fails
      setTimeout(() => {
        const mockDiagnosis = {
          disease: "Pneumonia",
          severity: "Moderate",
          recommendedAction: "Seek medical attention within 24 hours",
          details:
            "Based on your symptoms and vital signs, you may have pneumonia. This requires medical evaluation and likely antibiotic treatment.",
          date: new Date().toISOString(),
        };

        dispatch({ type: "SET_DIAGNOSIS", payload: mockDiagnosis });
      }, 1000);
    }
  };

  // Pakistani cities list
  const pakistanCities = [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Peshawar",
    "Quetta",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sukkur",
    "Larkana",
    "Sheikhupura",
    "Hyderabad",
    "Mardan",
    "Abbottabad",
    "Gujrat",
    "Jhang",
    "Sahiwal",
    "Kasur",
    "Okara",
    "Chiniot",
    "Kamoke",
    "Sadiqabad",
    "Burewala",
    "Jacobabad",
    "Muzaffargarh",
    "Jhelum",
    "Khanpur",
    "Khanewal",
    "Hafizabad",
    "Kohat",
    "Rahim Yar Khan",
    "Mirpur Khas",
    "Dera Ghazi Khan",
    "Nawabshah",
    "Mingora",
    "Charsadda",
    "Kamalia",
    "Sargodha",
    "Dadu",
    "Khuzdar",
    "Mansehra",
    "Layyah",
    "Swabi",
    "Khairpur",
    "Nowshera",
    "Kotri",
    "Attock",
    "Toba Tek Singh",
    "Murree",
    "Taxila",
    "Chakwal",
    "Swat",
    "Chaman",
    "Haripur",
    "Ghotki",
    "Vehari",
    "Pakpattan",
    "Bahawalnagar",
    "Tando Adam",
    "Tando Allahyar",
    "Mianwali",
    "Bhakkar",
    "Kohlu",
    "Kashmor",
    "Badin",
    "Lakki Marwat",
    "Lodhran",
    "Khushab",
    "Haripur",
    "Shikarpur",
    "Narowal",
    "Kharan",
    "Chitral",
    "Hangu",
    "Dir",
    "Bannu",
    "Thatta",
    "Kalat",
    "Mastung",
    "Hunza",
    "Gwadar",
    "Gilgit",
  ].sort();

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Patient Information</FormTitle>

      <FormSection>
        <SectionTitle>Personal Information</SectionTitle>
        <InputGroup>
          <FormGroup fullWidth>
            <Label htmlFor="name">
              <FaUser /> Full Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </FormGroup>
        </InputGroup>
        
        <InputGroup>
          <FormGroup>
            <Label htmlFor="age">
              <FaCalendarAlt /> Age
            </Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              max="120"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">
              <FaVenusMars /> Gender
            </Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </FormGroup>
        </InputGroup>
        
        <InputGroup>
          <FormGroup fullWidth>
            <Label htmlFor="location">
              <FaMapMarkerAlt /> Location
            </Label>
            <Select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select location</option>
              {pakistanCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </FormGroup>
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Vital Signs</SectionTitle>
        <InputGroup>
          <FormGroup>
            <Label htmlFor="temperature">
              <FaThermometerHalf /> Temperature (°F)
            </Label>
            <Input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              step="1"
              min="90"
              max="110"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="systolicBP">
              <FaHeartbeat /> Blood Pressure (mmHg)
            </Label>
            <BPInputContainer>
              <BPInput
                type="number"
                id="systolicBP"
                name="systolicBP"
                value={formData.systolicBP}
                onChange={handleChange}
                placeholder="Systolic"
                min="60"
                max="250"
                required
              />
              <BPSeparator>/</BPSeparator>
              <BPInput
                type="number"
                id="diastolicBP"
                name="diastolicBP"
                value={formData.diastolicBP}
                onChange={handleChange}
                placeholder="Diastolic"
                min="40"
                max="150"
                required
              />
            </BPInputContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="sugarLevel">
              <FaTint /> Blood Sugar Level (mg/dL)
            </Label>
            <Input
              type="number"
              id="sugarLevel"
              name="sugarLevel"
              value={formData.sugarLevel}
              onChange={handleChange}
              min="0"
              required
            />
          </FormGroup>
        </InputGroup>

        <FormGroup>
          <Label>
            <FaBaby /> Pregnancy Status
          </Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="pregnant"
                value="yes"
                checked={formData.pregnant === "yes"}
                onChange={handleChange}
                disabled={formData.gender === "male"}
              />
              Yes
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="pregnant"
                value="no"
                checked={formData.pregnant === "no"}
                onChange={handleChange}
              />
              No
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Symptoms</SectionTitle>
        <FormGroup fullWidth>
          <Label htmlFor="symptoms">
            <FaNotesMedical /> Describe your symptoms in detail
          </Label>
          <TextArea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Please describe all your symptoms in detail, including when they started and any changes you've noticed..."
            required
          />
        </FormGroup>

        <SymptomImageUpload onImageUpload={handleImageUpload} />
      </FormSection>

      <SubmitButton type="submit">Submit Assessment</SubmitButton>
    </FormContainer>
  );
};

export default PatientForm;
