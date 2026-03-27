import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, register as apiRegister } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AuthForm = ({ onSubmit, fields, submitButtonText, title }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("AuthForm submission error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {fields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name} className="capitalize">{field.placeholder}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  autoComplete={field.autoComplete}
                />
              </div>
            ))}
            <Button type="submit" className="w-full" loading={loading}>
              {submitButtonText}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const data = await apiLogin(formData.username, formData.password);
    login(data.access, data.refresh, formData.username);
    navigate("/record");
  };

  const fields = [
    { name: "username", type: "text", placeholder: "Username", required: true },
    { name: "password", type: "password", placeholder: "Password", required: true, autoComplete: "current-password" },
  ];

  return <AuthForm onSubmit={handleSubmit} fields={fields} submitButtonText="Login" title="Login" />;
};

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await apiRegister(formData.username, formData.email, formData.password);
    const loginData = await apiLogin(formData.username, formData.password);
    login(loginData.access, loginData.refresh, formData.username);
    navigate("/record");
  };

  const fields = [
    { name: "username", type: "text", placeholder: "Username", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    { name: "password", type: "password", placeholder: "Password", required: true, autoComplete: "new-password" },
  ];

  return <AuthForm onSubmit={handleSubmit} fields={fields} submitButtonText="Register" title="Register" />;
};