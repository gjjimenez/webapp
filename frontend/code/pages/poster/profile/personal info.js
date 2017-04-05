import React, { PropTypes, Component } from 'react'
import { flat as style } from 'react-styling'
// import { connect } from 'react-redux'

import { defineMessages } from 'react-intl'

import international from '../../../international/internationalize'

import Text_input     from '../../../components/form/text input'
import Select         from '../../../components/form/select'

// import
// {
// 	update_poster
// }
// from '../../../redux/poster/profile'

// @connect
// (
// 	undefined,
// 	{
// 		update_poster
// 	}
// )
@international
export default class Personal_info extends Component
{
	static contextTypes =
	{
		intl: PropTypes.object
	}

	static propTypes =
	{
		edit   : PropTypes.bool.isRequired,
		poster : PropTypes.object.isRequired,
		// submit : PropTypes.func.isRequired
	}

	static defaultProps =
	{
		edit : false
	}

	constructor(props, context)
	{
		super(props, context)

		// Fill two-letter country codes list

		this.countries = []

		for (let key of Object.keys(context.intl.messages))
		{
			if (key.starts_with('country.'))
			{
				key = key.substring('country.'.length)
				if (key.length === 2)
				{
					this.countries.push(key)
				}
			}
		}

		this.countries = this.countries.filter(code => code !== 'ZZ')
			.map(code =>
			({
				value: code,
				label: context.intl.messages[`country.${code}`]
			}))
			.sort((a, b) => a.label.localeCompare(b.label, props.locale))
	}

	get_values(values)
	{
		const result =
		{
			name    : values.name,
			country : values.country,
			place   : values.place
		}

		return result
	}

	render()
	{
		const
		{
			poster,
			edit,
			submitting,
			translate
		}
		= this.props

		const markup =
		(
			<div className="poster-info">
				{ edit &&
					<div className="rrui__form__fields">
						{/* Edit poster's name */}
						<Text_input
							name="name"
							label={ translate(messages.name) }
							value={ poster.name }
							validate={ this.validate_name }/>

						{/* Edit poster's place (e.g. "Moscow") */}
						{/* City, town, etc */}
						<Text_input
							name="place"
							label={ translate(messages.place) }
							disabled={ submitting }
							value={ poster.place }/>

						{/* Edit poster's country (e.g. "Russia") */}
						{/* Country */}
						<Select
							autocomplete
							autocompleteShowAll
							name="country"
							label={ translate(messages.country) }
							disabled={ submitting }
							options={ this.countries }
							value={ poster.country }/>
					</div>
				}

				{ !edit &&
					<div>
						{/* User's name */}
						<h1
							style={ styles.poster_name }
							className="poster-info__name">
							{ poster.name }
						</h1>

						{/* User's place and country */}
						{ (poster.place || poster.country) &&
							<div
								className="poster-profile__location">
								{ this.whereabouts().join(', ') }
							</div>
						}
					</div>
				}
			</div>
		)

		return markup
	}

	// User's [place, country]
	whereabouts()
	{
		const { poster, translate } = this.props

		const whereabouts = []

		if (poster.place)
		{
			whereabouts.push(poster.place)
		}

		if (poster.country)
		{
			whereabouts.push(translate({ id: `country.${poster.country}` }))
		}

		return whereabouts
	}

	validate_name = (value) =>
	{
		const { translate } = this.props

		if (!value)
		{
			return translate(messages.name_is_required)
		}
	}
}

const styles = style
`
	poster_name
		font-size     : 1.5rem
		margin-bottom : 0
`

const messages = defineMessages
({
	name:
	{
		id             : `poster.profile.name`,
		description    : `User's name`,
		defaultMessage : `Name`
	},
	place:
	{
		id             : `poster.profile.place`,
		description    : `User's place of living`,
		defaultMessage : `Place`
	},
	country:
	{
		id             : `poster.profile.country`,
		description    : `User's country`,
		defaultMessage : `Choose your country`
	}
})

// Retrieves the edited values
Personal_info.get_values = (ref, values) =>
{
	// First `react-intl` wrapper
	ref = ref.refs.wrappedInstance

	// Then `@international` wrapper
	ref = ref.wrappedInstance

	// Finally, collect the edited values
	return ref.get_values(values)
}