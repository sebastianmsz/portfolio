import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from '../contexts/LanguageContext'

export function ContactForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [feedback, setFeedback] = useState('')
    const { toast } = useToast()
    const { translate } = useLanguage()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })

            if (response.ok) {
                setFeedback(translate("contactSuccess"))
                setName('')
                setEmail('')
                setMessage('')
            } else {
                setFeedback(translate("contactError"))
            }
        } catch (error) {
            setFeedback(translate("contactError"))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                    {translate('name')}
                </label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {translate('email')}
                </label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                    {translate('message')}
                </label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">{translate('send')}</Button>
            {feedback && <p className="mt-4 text-sm text-green-600">{feedback}</p>}
        </form>
    )
}