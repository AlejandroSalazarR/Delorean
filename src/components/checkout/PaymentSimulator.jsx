import { useState } from 'react'
import { CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import {
  formatCardNumber, formatExpiry, luhn, validCvv, validDocument, validEmail, validExpiry, validNequi,
} from './validate'

const GATEWAYS =['Wompi', 'Mercado Pago']
const METHODS = [
  ['card', 'Tarjeta', CreditCard],
  ['pse', 'PSE', Landmark],
  ['nequi', 'Nequi', Smartphone],
]
const BANKS = ['Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA Colombia', 'Banco de Occidente', 'Banco Popular', 'Scotiabank Colpatria', 'Banco Caja Social']
const INSTALLMENTS = [1, 3, 6, 12, 24, 36]
const input = 'w-full rounded-full border border-[rgba(0,0,0,0.06)] bg-[#F8F9FA] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#FF6B00] aria-[invalid=true]:border-[#FF6B00]'

const RULES = {
  card: {
    number: [luhn, 'Revisa el número de la tarjeta.'],
    name: [(v) => v.trim().length >= 3, 'Escribe el nombre como aparece en la tarjeta.'],
    expiry: [(v) => validExpiry(v), 'Usa una fecha MM/AA que no esté vencida.'],
    cvv: [validCvv, 'El CVV tiene 3 o 4 dígitos.'],
  },
  pse: {
    bank: [Boolean, 'Elige tu banco.'],
    document: [validDocument, 'El documento debe tener entre 5 y 12 dígitos.'],
    email: [validEmail, 'Escribe un correo válido para recibir el comprobante.'],
  },
  nequi: {
    phone: [validNequi, 'Escribe el celular de 10 dígitos registrado en Nequi.'],
  },
}

function Field({ id, label, error, children, className = '' }) {
  return (
    <label htmlFor={id} className={`grid gap-1 text-sm ${className}`}>
      <span className="pl-1 font-medium">{label}</span>
      {children}
      {error && <span id={`${id}-error`} className="pl-1 text-xs font-semibold text-[#FF6B00]">{error}</span>}
    </label>
  )
}

function Pills({ label, options, value, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-[#F8F9FA] p-1">
      {options.map(([v, l, Icon]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 ${
            value === v ? 'bg-white text-[#111111] shadow-[0_4px_12px_-4px_rgba(17,17,17,0.15)]' : 'text-[#111111]/50 hover:text-[#111111]'
          }`}
        >
          {Icon && <Icon size={15} />} {l}
        </button>
      ))}
    </div>
  )
}

// Online checkout mock-up: validates formats only and never sends payment data anywhere.
export default function PaymentSimulator({ formId, onPay }) {
  const [gateway, setGateway] = useState(GATEWAYS[0])
  const [method, setMethod] = useState('card')
  const [values, setValues] = useState({ number: '', name: '', expiry: '', cvv: '', installments: '1', personType: 'natural', bank: '', docType: 'CC', document: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})

  const set = (key, format = (v) => v) => (e) => {
    setValues((s) => ({ ...s, [key]: format(e.target.value) }))
    setErrors((s) => ({ ...s, [key]: undefined }))
  }
  const fieldProps = (key) => ({
    id: `pay-${key}`,
    value: values[key],
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `pay-${key}-error` : undefined,
  })

  const submit = (e) => {
    e.preventDefault()
    const found = Object.fromEntries(
      Object.entries(RULES[method]).filter(([k, [ok]]) => !ok(values[k])).map(([k, [, msg]]) => [k, msg])
    )
    setErrors(found)
    if (Object.keys(found).length) return
    const detail = method === 'card' ? `Tarjeta terminada en ${values.number.slice(-4)}, ${values.installments} cuota(s)` : method === 'pse' ? `PSE, ${values.bank}` : `Nequi ${values.phone.slice(-4)}`
    onPay({ gateway, detail })
  }

  return (
    <form id={formId} onSubmit={submit} noValidate className="grid gap-4">
      <div>
        <p className="mb-2 pl-1 text-sm font-medium">Pasarela</p>
        <Pills label="Pasarela de pago" options={GATEWAYS.map((g) => [g, g])} value={gateway} onChange={setGateway} />
      </div>
      <Pills label="Medio de pago" options={METHODS} value={method} onChange={(m) => { setMethod(m); setErrors({}) }} />

      {method === 'card' && (
        <div className="grid grid-cols-2 gap-3">
          <Field id="pay-number" label="Número de tarjeta" error={errors.number} className="col-span-2">
            <input {...fieldProps('number')} onChange={set('number', formatCardNumber)} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className={`${input} tabular-nums`} />
          </Field>
          <Field id="pay-name" label="Nombre en la tarjeta" error={errors.name} className="col-span-2">
            <input {...fieldProps('name')} onChange={set('name')} autoComplete="cc-name" placeholder="Como aparece en el plástico" className={input} />
          </Field>
          <Field id="pay-expiry" label="Vence" error={errors.expiry}>
            <input {...fieldProps('expiry')} onChange={set('expiry', formatExpiry)} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" className={`${input} tabular-nums`} />
          </Field>
          <Field id="pay-cvv" label="CVV" error={errors.cvv}>
            <input {...fieldProps('cvv')} onChange={set('cvv', (v) => v.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={`${input} tabular-nums`} />
          </Field>
          <Field id="pay-installments" label="Cuotas" className="col-span-2">
            <select {...fieldProps('installments')} onChange={set('installments')} className={input}>
              {INSTALLMENTS.map((n) => <option key={n} value={n}>{n === 1 ? '1 cuota (contado)' : `${n} cuotas`}</option>)}
            </select>
          </Field>
        </div>
      )}

      {method === 'pse' && (
        <div className="grid grid-cols-2 gap-3">
          <Field id="pay-personType" label="Tipo de persona" className="col-span-2">
            <select {...fieldProps('personType')} onChange={set('personType')} className={input}>
              <option value="natural">Persona natural</option>
              <option value="juridica">Persona jurídica</option>
            </select>
          </Field>
          <Field id="pay-bank" label="Banco" error={errors.bank} className="col-span-2">
            <select {...fieldProps('bank')} onChange={set('bank')} className={input}>
              <option value="">Elige tu banco</option>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field id="pay-docType" label="Documento">
            <select {...fieldProps('docType')} onChange={set('docType')} className={input}>
              <option value="CC">CC</option>
              <option value="CE">CE</option>
              <option value="NIT">NIT</option>
              <option value="PP">Pasaporte</option>
            </select>
          </Field>
          <Field id="pay-document" label="Número" error={errors.document}>
            <input {...fieldProps('document')} onChange={set('document', (v) => v.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="1036000000" className={`${input} tabular-nums`} />
          </Field>
          <Field id="pay-email" label="Correo" error={errors.email} className="col-span-2">
            <input {...fieldProps('email')} onChange={set('email')} type="email" autoComplete="email" placeholder="tu@correo.com" className={input} />
          </Field>
        </div>
      )}

      {method === 'nequi' && (
        <div className="grid gap-3">
          <Field id="pay-phone" label="Celular Nequi" error={errors.phone}>
            <input {...fieldProps('phone')} onChange={set('phone', (v) => v.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" autoComplete="tel-national" placeholder="3001234567" className={`${input} tabular-nums`} />
          </Field>
          <p className="pl-1 text-xs text-[#111111]/60">Te llegará una notificación en la app de Nequi para aprobar el pago.</p>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-[18px] bg-[#F8F9FA] p-3 text-xs text-[#111111]/60">
        <ShieldCheck size={16} className="mt-px shrink-0 text-[#FF6B00]" />
        Simulador de {gateway}: no se realiza ningún cobro ni se envían tus datos. Para probar con tarjeta usa 4242 4242 4242 4242.
      </p>
    </form>
  )
}
