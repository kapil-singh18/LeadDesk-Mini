import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { createLeadSchema, CreateLeadInput } from '../../validators/leadValidator.js';
import { leadApiClient } from '../../services/leadApiClient.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Textarea } from '../ui/Textarea.js';
import { Select } from '../ui/Select.js';
import { Card } from '../ui/Card.js';

const BUDGET_OPTIONS = [
  { value: '$1,000 - $5,000', label: '$1,000 - $5,000' },
  { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
  { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
  { value: '$25,000+', label: '$25,000+' },
];

export const LeadFormSection: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (data: CreateLeadInput) => {
    setServerError(null);
    try {
      const response = await leadApiClient.submitLead(data);
      if (response.success) {
        setIsSubmitted(true);
        reset();
      } else {
        const errorMsg =
          typeof response.error === 'string'
            ? response.error
            : (response.error as any)?.message || 'Failed to submit lead.';
        setServerError(errorMsg);

        // Handle field-level errors returned by Zod from backend
        if (typeof response.error === 'object' && (response.error as any)?.fields) {
          const fields = (response.error as any).fields as Record<string, string>;
          Object.entries(fields).forEach(([field, msg]) => {
            setError(field as any, { message: msg });
          });
        }
      }
    } catch (err: any) {
      console.error('Lead submission error:', err);
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        'A network or server error occurred. Please try again.';
      setServerError(message);
    }
  };

  return (
    <section id="lead-form" className="py-20 bg-[#F8F9FD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F3FF] text-[#5F6FFF] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Direct Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Tell Us About Your Project
          </h2>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Fill out the form below to submit your request directly to our team. An admin will review and follow up shortly.
          </p>
        </div>

        <Card className="shadow-card border-gray-100 bg-white">
          {isSubmitted ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lead Submitted Successfully!</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for getting in touch. Your lead has been logged into our system and set to <span className="font-semibold text-[#5F6FFF]">New</span> status for review.
              </p>
              <div className="pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsSubmitted(false)}
                  className="gap-2"
                >
                  Submit Another Lead
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {serverError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Submission Error: </span>
                    {serverError}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. Jane Doe"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. jane@company.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Select
                label="Budget Range"
                placeholder="Select estimated budget"
                options={BUDGET_OPTIONS}
                error={errors.budget?.message}
                {...register('budget')}
              />

              <Textarea
                label="Project Message / Details"
                placeholder="Describe your project, timeline, and requirements in detail..."
                rows={5}
                error={errors.message?.message}
                {...register('message')}
              />

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Lead Request
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
};
