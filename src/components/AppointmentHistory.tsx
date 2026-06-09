import {
	Calendar,
	Clock,
	Stethoscope,
	CheckCircle,
	XCircle,
	AlertCircle,
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentHistoryProps {
	appointments: Appointment[];
	onBookNew: () => void;
}

export default function AppointmentHistory({
	appointments,
	onBookNew,
}: AppointmentHistoryProps) {
	const getStatusStyles = (status: Appointment['status']) => {
		switch (status) {
			case 'Confirmed':
				return { bg: 'bg-success', text: 'text-on-success', icon: CheckCircle };
			case 'Pending':
				return { bg: 'bg-warning', text: 'text-on-warning', icon: AlertCircle };
			case 'Completed':
				return { bg: 'bg-success', text: 'text-on-success', icon: CheckCircle };
			case 'Cancelled':
				return {
					bg: 'bg-error-container',
					text: 'text-on-error-container',
					icon: XCircle,
				};
			default:
				return {
					bg: 'bg-surface-container',
					text: 'text-on-surface-variant',
					icon: Calendar,
				};
		}
	};

	const sorted = [...appointments].sort((a, b) => {
		const dateA = new Date(a.date + ' ' + a.time);
		const dateB = new Date(b.date + ' ' + b.time);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<div className='space-y-8 py-5'>
			<div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-on-surface'>
						Visit History
					</h1>
					<p className='text-sm text-on-surface-variant mt-1.5'>
						Review your past and upcoming medical appointments.
					</p>
				</div>
				<button
					onClick={onBookNew}
					className='px-6 py-2.5 bg-primary-container text-on-primary-container text-sm font-bold rounded-lg hover:brightness-105 transition-all cursor-pointer'
				>
					Book New Visit
				</button>
			</div>

			<div className='bg-white rounded-xl border border-outline-variant/30 shadow-[var(--shadow-primary)] overflow-hidden'>
				{sorted.length > 0 ? (
					<div className='divide-y divide-outline-variant/30'>
						{sorted.map((appt) => {
							const statusStyle = getStatusStyles(appt.status);
							const StatusIcon = statusStyle.icon;
							return (
								<div
									key={appt.id}
									className='p-5 hover:bg-surface-container-low/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4'
								>
									<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
										<Stethoscope size={22} className='text-primary' />
									</div>
									<div className='flex-grow min-w-0'>
										<h3 className='font-bold text-on-surface'>
											{appt.doctorName}
										</h3>
										<p className='text-xs text-on-surface-variant mt-0.5'>
											{appt.specialty}
										</p>
										<div className='flex flex-wrap gap-3 mt-2 text-xs text-on-surface-variant'>
											<span className='flex items-center gap-1'>
												<Calendar size={12} /> {appt.date}
											</span>
											<span className='flex items-center gap-1'>
												<Clock size={12} /> {appt.time}
											</span>
											<span className='font-semibold text-primary'>
												{appt.serviceType}
											</span>
										</div>
									</div>
									<div className='flex items-center gap-3 shrink-0'>
										<span
											className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusStyle.bg} ${statusStyle.text}`}
										>
											<StatusIcon size={12} />
											{appt.status}
										</span>
										<span className='text-sm font-bold text-on-surface'>
											${appt.cost}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className='p-12 text-center'>
						<p className='text-on-surface-variant font-medium'>
							No appointments recorded yet.
						</p>
						<button
							onClick={onBookNew}
							className='mt-4 px-6 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:brightness-105 cursor-pointer'
						>
							Schedule Your First Visit
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
