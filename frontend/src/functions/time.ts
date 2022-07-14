import { format, isSameMinute, isToday } from "date-fns"

export default function relativeTime(date: Date) {
    if (isSameMinute(new Date(), date)) {
        return "Now"
    } else if (isToday(date)) {
        return format(date, "HH:mm")
    } else {
        return format(date, "dd/MM/yyyy")
    }
}