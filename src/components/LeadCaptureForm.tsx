import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalculationResults } from '@/lib/calculations';
import { generatePDF } from '@/lib/pdf-generator';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX')
    .or(z.string().min(10, 'WhatsApp inválido')),
  clinic: z.string().min(3, 'Nome da clínica deve ter no mínimo 3 caracteres'),
  consent: z.boolean().refine((v) => v === true, 'Você deve aceitar os termos'),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  results: CalculationResults;
  answers: any;
}

export function LeadCaptureForm({ results, answers }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      clinic: '',
      consent: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Generate PDF
      const pdfBlob = generatePDF(results, {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        clinic: data.clinic,
      });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Send to webhook
      const webhookPayload = {
        timestamp: new Date().toISOString(),
        quickCalc: {
          leads: answers.leads,
          ticket: answers.ticket,
          leakage: answers.leads * 0.3 * answers.ticket * 0.4,
        },
        answers: answers,
        results: {
          scores: results.scores,
          leakages: results.leakages,
          total: results.total,
        },
        lead: {
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          clinic: data.clinic,
        },
      };

      const response = await fetch('https://n8n.eucalyptus.solutions/webhook/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error('Webhook failed');
      }

      setIsComplete(true);
      toast.success('Diagnóstico enviado com sucesso!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao enviar. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete && pdfUrl) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card rounded-2xl p-8 shadow-lg border border-border text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Diagnóstico Completo!</h3>
          <p className="text-muted-foreground mb-6">
            Seu relatório foi gerado e enviado para seu email. Você também pode fazer o download agora:
          </p>
          <a
            href={pdfUrl}
            download="diagnostico-eucalyptus.pdf"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar PDF
          </a>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card rounded-2xl p-8 shadow-lg border border-border"
      >
        <h3 className="text-2xl font-bold mb-2">Receba Seu Diagnóstico Completo</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Preencha os dados abaixo para receber seu relatório em PDF
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Profissional</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clinic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Clínica</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da sua clínica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0 p-4 bg-muted/20 rounded-lg">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm leading-relaxed cursor-pointer">
                    Aceito receber o diagnóstico e comunicações da Eucalyptus sobre soluções de gestão
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? 'GERANDO PDF...' : 'RECEBER DIAGNÓSTICO'}
            </Button>
          </form>
        </Form>
      </motion.div>
    </section>
  );
}
