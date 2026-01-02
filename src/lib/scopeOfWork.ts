export interface ScopeOptions {
  hasAcUnit: boolean
  hasFlatSection: boolean
}

export function getScopeOfWork(options: ScopeOptions): string {
  const { hasAcUnit, hasFlatSection } = options

  if (!hasAcUnit && !hasFlatSection) {
    return getBaseScope()
  } else if (hasAcUnit && !hasFlatSection) {
    return getAcUnitScope()
  } else if (!hasAcUnit && hasFlatSection) {
    return getFlatRoofScope()
  } else {
    return getAcUnitAndFlatRoofScope()
  }
}

function getBaseScope(): string {
  return `SCOPE OF WORK – FULL SHINGLE ROOF REPLACEMENT

Phase 1: Removal & Preparation
• Remove all existing shingle roofing materials down to the roof decking and properly dispose of all debris.
• Protect landscaping, exterior walls, AC units, pool areas, and walkways during the removal process.
• Inspect the roof decking for damage, rot, delamination, or soft spots.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 2: Underlayment & Deck Preparation
• Install new synthetic underlayment over the entire roof surface in accordance with manufacturer specifications.
• Ensure proper fastening pattern per manufacturer requirements.
• Install ice and water shield membrane at all valleys, eaves, and penetration areas as required by code.

Phase 3: Shingle Installation
• Install new architectural asphalt shingles of the selected color and style, following manufacturer specifications.
• Install new starter course shingles along all eaves and rakes.
• Install new ridge cap shingles at all ridge and hip locations.
• Replace or install new metal edging/drip edge around the roof perimeter.
• Seal all nail heads and flashing points to ensure a watertight finish.

Phase 4: Flashing & Penetrations
• Reinstall or replace step flashing, counter flashing, and apron flashing as needed at all roof-to-wall transitions.
• Replace all pipe jacks with new lead or galvanized pipe flashings as appropriate.
• Replace all roof vents, attic vents, O'Hagin or turtle vents, and other penetrations with new, properly flashed materials.
• Inspect and seal all roof penetrations including skylights, chimneys, HVAC stacks, and plumbing penetrations.

Phase 5: Ventilation
• Inspect existing attic ventilation system for adequacy per current building code requirements.
• Install or replace ridge vent, off-ridge vents, or static vents as required to meet proper ventilation standards.
• Ensure balanced intake and exhaust ventilation throughout the attic space.

Phase 6: Finalization & Cleanup
• Perform full jobsite cleanup, including removal of all roofing debris.
• Magnet-sweep the property and surrounding areas to collect loose nails.
• Conduct final inspection to ensure proper installation and a watertight system.
• Provide manufacturer warranty documentation and contractor workmanship warranty upon completion.
• Final walkthrough with homeowner.`
}

function getAcUnitScope(): string {
  return `SCOPE OF WORK – FULL SHINGLE ROOF REPLACEMENT WITH ROOFTOP HVAC

Phase 1: Removal & Preparation
• Remove all existing shingle roofing materials down to the roof decking and properly dispose of all debris.
• Protect landscaping, exterior walls, pool areas, and walkways during the removal process.
• Inspect the roof decking for damage, rot, delamination, or soft spots.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 2: HVAC Disconnection & Equipment Handling
• Coordinate with licensed HVAC technician to disconnect rooftop air conditioning unit(s), including refrigerant lines, electrical connections, and condensate lines.
• Remove and set aside rooftop AC unit and associated curb/equipment stand to allow for roof replacement beneath unit location.
• Protect HVAC equipment during roofing operations.

Phase 3: Underlayment & Deck Preparation
• Install new synthetic underlayment over the entire roof surface, including beneath AC unit footprint, in accordance with manufacturer specifications.
• Ensure proper fastening pattern per manufacturer requirements.
• Install ice and water shield membrane at all valleys, eaves, and penetration areas as required by code.

Phase 4: Shingle Installation
• Install new architectural asphalt shingles of the selected color and style, following manufacturer specifications.
• Install new starter course shingles along all eaves and rakes.
• Install new ridge cap shingles at all ridge and hip locations.
• Replace or install new metal edging/drip edge around the roof perimeter.
• Seal all nail heads and flashing points to ensure a watertight finish.

Phase 5: Flashing & Penetrations
• Reinstall or replace step flashing, counter flashing, and apron flashing as needed at all roof-to-wall transitions.
• Replace all pipe jacks with new lead or galvanized pipe flashings as appropriate.
• Replace all roof vents, attic vents, O'Hagin or turtle vents, and other penetrations with new, properly flashed materials.
• Inspect and seal all roof penetrations including skylights, chimneys, HVAC stacks, and plumbing penetrations.

Phase 6: HVAC Reconnection & Integration
• Install or replace AC curb/equipment stand flashing and integrate with new roofing system per manufacturer specifications.
• Reset rooftop AC unit onto curb/stand in original position.
• Coordinate with licensed HVAC technician to reconnect refrigerant lines, electrical, and condensate lines.
• Verify proper operation of HVAC system upon reconnection.
• Seal all penetrations associated with HVAC equipment with compatible roofing sealant.

Phase 7: Ventilation
• Inspect existing attic ventilation system for adequacy per current building code requirements.
• Install or replace ridge vent, off-ridge vents, or static vents as required to meet proper ventilation standards.
• Ensure balanced intake and exhaust ventilation throughout the attic space.

Phase 8: Finalization & Cleanup
• Perform full jobsite cleanup, including removal of all roofing debris.
• Magnet-sweep the property and surrounding areas to collect loose nails.
• Conduct final inspection to ensure proper installation and a watertight system.
• Provide manufacturer warranty documentation and contractor workmanship warranty upon completion.
• Confirm HVAC system operation with homeowner.
• Final walkthrough with homeowner.`
}

function getFlatRoofScope(): string {
  return `SCOPE OF WORK – FULL SHINGLE ROOF REPLACEMENT WITH FLAT ROOF SECTION

Phase 1: Removal & Preparation – Sloped Sections
• Remove all existing shingle roofing materials down to the roof decking on all sloped sections and properly dispose of all debris.
• Protect landscaping, exterior walls, AC units, pool areas, and walkways during the removal process.
• Inspect the roof decking for damage, rot, delamination, or soft spots.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 2: Removal & Preparation – Flat Roof Section
• Remove existing flat roof membrane (built-up, modified bitumen, TPO, or EPDM) down to roof deck on all flat/low-slope sections.
• Properly dispose of all flat roof debris in accordance with local regulations.
• Inspect flat roof sheathing/decking for damage, rot, or deterioration.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 3: Underlayment & Deck Preparation – Sloped Sections
• Install new synthetic underlayment over all sloped roof surfaces in accordance with manufacturer specifications.
• Ensure proper fastening pattern per manufacturer requirements.
• Install ice and water shield membrane at all valleys, eaves, and penetration areas as required by code.

Phase 4: Flat Roof Membrane Installation
• Install tapered insulation or crickets as necessary to ensure positive drainage toward existing scuppers, drains, or roof edge.
• Install new flat roof membrane system (modified bitumen, TPO, or approved single-ply membrane) per manufacturer specifications and code requirements.
• Install new metal edge/drip edge or gravel stop at all flat roof perimeters.
• Flash and seal all flat roof penetrations including plumbing vents and conduit.
• Apply reflective coating to flat roof surface if specified or required for energy code compliance.

Phase 5: Shingle Installation – Sloped Sections
• Install new architectural asphalt shingles of the selected color and style, following manufacturer specifications.
• Install new starter course shingles along all eaves and rakes.
• Install new ridge cap shingles at all ridge and hip locations.
• Replace or install new metal edging/drip edge around the roof perimeter on sloped sections.
• Seal all nail heads and flashing points to ensure a watertight finish.

Phase 6: Transition Flashing & System Integration
• Install transition flashing at all slope-to-flat roof tie-in points.
• Ensure watertight integration between shingle system and flat roof membrane.
• Seal all transition points with compatible roofing sealant and membrane adhesive.

Phase 7: Flashing & Penetrations
• Reinstall or replace step flashing, counter flashing, and apron flashing as needed at all roof-to-wall transitions.
• Replace all pipe jacks with new lead or galvanized pipe flashings as appropriate on sloped sections.
• Replace all roof vents, attic vents, O'Hagin or turtle vents, and other penetrations with new, properly flashed materials.
• Inspect and seal all roof penetrations including skylights, chimneys, HVAC stacks, and plumbing penetrations.
• Re-flash or replace scupper boxes and overflow drains on flat sections as required.

Phase 8: Ventilation
• Inspect existing attic ventilation system for adequacy per current building code requirements.
• Install or replace ridge vent, off-ridge vents, or static vents as required to meet proper ventilation standards.
• Ensure balanced intake and exhaust ventilation throughout the attic space.

Phase 9: Finalization & Cleanup
• Perform full jobsite cleanup, including removal of all roofing debris.
• Magnet-sweep the property and surrounding areas to collect loose nails.
• Conduct final inspection of both sloped and flat roof sections to ensure proper installation and watertight systems.
• Provide manufacturer warranty documentation and contractor workmanship warranty upon completion.
• Final walkthrough with homeowner.`
}

function getAcUnitAndFlatRoofScope(): string {
  return `SCOPE OF WORK – FULL SHINGLE ROOF REPLACEMENT WITH FLAT ROOF SECTION & ROOFTOP HVAC

Phase 1: Removal & Preparation – Sloped Sections
• Remove all existing shingle roofing materials down to the roof decking on all sloped sections and properly dispose of all debris.
• Protect landscaping, exterior walls, pool areas, and walkways during the removal process.
• Inspect the roof decking for damage, rot, delamination, or soft spots.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 2: Removal & Preparation – Flat Roof Section
• Remove existing flat roof membrane (built-up, modified bitumen, TPO, or EPDM) down to roof deck on all flat/low-slope sections.
• Properly dispose of all flat roof debris in accordance with local regulations.
• Inspect flat roof sheathing/decking for damage, rot, or deterioration.
• Replace any compromised decking as needed (billed separately if applicable).

Phase 3: HVAC Disconnection & Equipment Handling
• Coordinate with licensed HVAC technician to disconnect rooftop air conditioning unit(s), including refrigerant lines, electrical connections, and condensate lines.
• Remove and set aside rooftop AC unit and associated curb/equipment stand to allow for roof replacement beneath unit location.
• Protect HVAC equipment during roofing operations.

Phase 4: Underlayment & Deck Preparation – Sloped Sections
• Install new synthetic underlayment over all sloped roof surfaces, including beneath AC unit footprint if located on sloped section, in accordance with manufacturer specifications.
• Ensure proper fastening pattern per manufacturer requirements.
• Install ice and water shield membrane at all valleys, eaves, and penetration areas as required by code.

Phase 5: Flat Roof Membrane Installation
• Install tapered insulation or crickets as necessary to ensure positive drainage toward existing scuppers, drains, or roof edge.
• Install new flat roof membrane system (modified bitumen, TPO, or approved single-ply membrane) per manufacturer specifications and code requirements, including beneath AC unit footprint if located on flat section.
• Install new metal edge/drip edge or gravel stop at all flat roof perimeters.
• Flash and seal all flat roof penetrations including plumbing vents and conduit.
• Apply reflective coating to flat roof surface if specified or required for energy code compliance.

Phase 6: Shingle Installation – Sloped Sections
• Install new architectural asphalt shingles of the selected color and style, following manufacturer specifications.
• Install new starter course shingles along all eaves and rakes.
• Install new ridge cap shingles at all ridge and hip locations.
• Replace or install new metal edging/drip edge around the roof perimeter on sloped sections.
• Seal all nail heads and flashing points to ensure a watertight finish.

Phase 7: Transition Flashing & System Integration
• Install transition flashing at all slope-to-flat roof tie-in points.
• Ensure watertight integration between shingle system and flat roof membrane.
• Seal all transition points with compatible roofing sealant and membrane adhesive.

Phase 8: HVAC Reconnection & Integration
• Install or replace AC curb/equipment stand; flash and integrate with flat roof membrane or shingle system as applicable per manufacturer specifications.
• Reset rooftop AC unit onto curb/stand in original position.
• Coordinate with licensed HVAC technician to reconnect refrigerant lines, electrical, and condensate lines.
• Verify proper operation of HVAC system upon reconnection.
• Seal all penetrations associated with HVAC equipment with compatible roofing sealant.

Phase 9: Flashing & Penetrations
• Reinstall or replace step flashing, counter flashing, and apron flashing as needed at all roof-to-wall transitions.
• Replace all pipe jacks with new lead or galvanized pipe flashings as appropriate on sloped sections.
• Replace all roof vents, attic vents, O'Hagin or turtle vents, and other penetrations with new, properly flashed materials.
• Inspect and seal all roof penetrations including skylights, chimneys, HVAC stacks, and plumbing penetrations.
• Re-flash or replace scupper boxes and overflow drains on flat sections as required.

Phase 10: Ventilation
• Inspect existing attic ventilation system for adequacy per current building code requirements.
• Install or replace ridge vent, off-ridge vents, or static vents as required to meet proper ventilation standards.
• Ensure balanced intake and exhaust ventilation throughout the attic space.

Phase 11: Finalization & Cleanup
• Perform full jobsite cleanup, including removal of all roofing debris.
• Magnet-sweep the property and surrounding areas to collect loose nails.
• Conduct final inspection of both sloped and flat roof sections to ensure proper installation and watertight systems.
• Confirm HVAC system operation with homeowner.
• Provide manufacturer warranty documentation and contractor workmanship warranty upon completion.
• Final walkthrough with homeowner.`
}

export function getWoodPriceList(): string {
  return `Wood Price List

We have included a wood price list for your review. Wood is never installed without your permission and knowledge. However, occasionally bad wood is discovered once the existing roof is removed.

The price list below is the cost per item material and installation and will be charged if wood is found to be necessary to complete the roofing work per code.

We will replace any wood that won't hold a nail. Attempts will be made to contact the customer before the wood is replaced to notify them of the additional charges.

Wood Schedule (Remove & Replace) (paint not included)
--1x4 Plank: $5.00/linear foot--
--1x6 Plank: $5.00/linear foot--
--1x8 Plank: $5.00/linear foot--
--1/2" CDX Plywood: $100.00/sheet--
--1/2" OSB Plywood: $100.00/sheet--
--1/2" ACX Plywood: $100.00/sheet--
--Trim Board (1x2, 1x3, 1x4): $5.00/linear foot--

FASCIA
--2X6 Fascia $15.00/linear foot--
--2X8 Fascia $15.00/linear foot--
--2X10 Fascia $15.00/linear foot--`
}
