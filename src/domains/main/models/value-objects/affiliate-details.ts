import { User } from '../entities/user';
import { Affiliate } from '../entities/affiliate';
import { ValueObject } from '@/core/entities/value-object';

interface AffiliateDetailsProps {
	affiliate: Affiliate;
	user: User;
}

export class AffiliateDetails extends ValueObject<AffiliateDetailsProps> {
	get affiliate() {
		return this.props.affiliate;
	}

	get user() {
		return this.props.user;
	}

	static create(props: AffiliateDetailsProps) {
		const item = new AffiliateDetails(props);

		return item;
	}
}
