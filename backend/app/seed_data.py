import re
from sqlalchemy.orm import Session
from app.models import WasteItem


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)


INITIAL_WASTE_ITEMS = [
    {
        "name": "Vegetable Peels & Kitchen Scraps",
        "category": "Wet / Biodegradable",
        "description": "Raw fruit and vegetable trimmings, peelings, stems, and leftover raw organic matter from food preparation.",
        "disposal_instructions": "Dispose in the green organic/wet bin. Ideal for home composting or campus vermicomposting pits.",
        "recycling_information": "Compostable into organic bio-fertilizer and soil conditioner. Helps divert organic matter from methane-emitting landfills.",
        "preparation_instructions": "Remove plastic stickers, rubber bands, or ties. Drain excess liquids before disposal.",
        "safety_warning": None,
        "recyclable": False,
        "compostable": True,
    },
    {
        "name": "Leftover Cooked Food",
        "category": "Wet / Biodegradable",
        "description": "Cooked rice, breads, gravies, and kitchen food leftovers.",
        "disposal_instructions": "Place in the green wet waste bin. Do not bag in single-use plastic.",
        "recycling_information": "Suitable for municipal biomethanation (biogas) digestion or commercial high-heat composting. Not recommended for simple open backyard compost if attracting pests.",
        "preparation_instructions": "Strain liquid sauces and drain gravy if possible. Avoid mixing with plastic packaging or toothpicks.",
        "safety_warning": None,
        "recyclable": False,
        "compostable": True,
    },
    {
        "name": "Tea Leaves & Coffee Grounds",
        "category": "Wet / Biodegradable",
        "description": "Used tea leaves, herbal infusions, and coffee grounds from brewing.",
        "disposal_instructions": "Place in the organic waste bin or apply directly to garden soil around acid-loving plants.",
        "recycling_information": "High in nitrogen and trace minerals, making it an excellent composting accelerator.",
        "preparation_instructions": "Remove synthetic tea bag mesh or staples. Only pure paper or loose leaves are compostable.",
        "safety_warning": None,
        "recyclable": False,
        "compostable": True,
    },
    {
        "name": "Old Newspapers & Magazines",
        "category": "Dry Recyclable",
        "description": "Printed daily newspapers, inserts, and glossy or uncoated magazines.",
        "disposal_instructions": "Place in the blue dry recyclable bin or bundle for local recycling collectors (kabadiwala / scrap dealers).",
        "recycling_information": "Widely recyclable into recycled paper, egg cartons, and paperboard packaging. Recycler acceptance is high worldwide.",
        "preparation_instructions": "Keep dry and clean. Remove plastic wrap sleeves or sticky attachments.",
        "safety_warning": None,
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Cardboard Boxes & Cartons",
        "category": "Dry Recyclable",
        "description": "Corrugated cardboard shipping boxes, clean cereal boxes, and paperboard cartons.",
        "disposal_instructions": "Flatten and place in the dry recyclable bin or take to a paper recycling center.",
        "recycling_information": "Can be repulped and recycled up to 5-7 times into fresh cardboard and packaging material.",
        "preparation_instructions": "Flatten completely to save bin space. Strip heavy plastic packing tape and remove styrofoam peanuts.",
        "safety_warning": None,
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "PET Plastic Bottles",
        "category": "Dry Recyclable",
        "description": "Transparent beverage bottles (water, soda) marked with resin identification code #1 (PET/PETE).",
        "disposal_instructions": "Place in the blue dry recyclable bin or campus plastic collection reverse-vending kiosk.",
        "recycling_information": "Highly recyclable into polyester textile fibers, tote bags, straps, and new beverage bottles.",
        "preparation_instructions": "Empty all liquids, rinse lightly, crush the bottle to conserve collection space, and recap.",
        "safety_warning": None,
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Multi-Layer Plastic Wrappers & Chip Packets",
        "category": "Residual / Non-Recyclable",
        "description": "Metallized plastic films, laminated snack wrappers, and multilayer packaging (MLP).",
        "disposal_instructions": "Dispose in the black/grey residual or non-recyclable bin.",
        "recycling_information": "Extremely difficult to recycle mechanically due to fused plastic-aluminum layers. Often sent to cement kilns for co-processing or waste-to-energy where facilities exist.",
        "preparation_instructions": "Ensure no food residue remains inside before discarding.",
        "safety_warning": None,
        "recyclable": False,
        "compostable": False,
    },
    {
        "name": "Glass Bottles & Jars",
        "category": "Dry Recyclable",
        "description": "Clear and colored glass containers from food sauces, juices, and drinks.",
        "disposal_instructions": "Deposit into the dry recyclable bin or glass collection point. Never mix with ceramics or window glass.",
        "recycling_information": "Glass is 100% recyclable indefinitely without loss in purity or quality.",
        "preparation_instructions": "Rinse clean, allow to dry, and remove metal or plastic caps (recycle caps separately).",
        "safety_warning": "Handle carefully to avoid breakage and cut injuries.",
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Aluminum & Tin Cans",
        "category": "Dry Recyclable",
        "description": "Soda beverage cans, canned food tins, and aerosol food cans (empty).",
        "disposal_instructions": "Place in the blue recyclable bin or hand over to scrap metal aggregators.",
        "recycling_information": "Recycling aluminum requires 95% less energy than producing raw metal from bauxite ore.",
        "preparation_instructions": "Rinse food residues thoroughly. Push can lid into the can so sharp edges are concealed.",
        "safety_warning": "Watch out for sharp tin edges after opening.",
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Used Alkaline & Lithium Batteries",
        "category": "Domestic Hazardous",
        "description": "Single-use AA, AAA, 9V alkaline batteries and rechargeable lithium-ion cells from consumer gadgets.",
        "disposal_instructions": "DO NOT throw into normal trash or dry bins. Take to a designated battery drop-off box or e-waste drive.",
        "recycling_information": "Specialized recyclers extract nickel, cobalt, zinc, and lithium while safely capturing toxic electrolytes.",
        "preparation_instructions": "Tape the terminals (especially 9V and lithium batteries) with clear or electrical tape to prevent short-circuit sparks.",
        "safety_warning": "Punctured or shorted batteries present serious fire and chemical leakage hazards.",
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Electronic Waste (Cables, Chargers & Small Gadgets)",
        "category": "Electronic Waste",
        "description": "Old mobile phones, broken chargers, USB cables, earphones, and printed circuit boards.",
        "disposal_instructions": "Hand over to authorized e-waste dismantlers or campus e-waste collection bins.",
        "recycling_information": "Contains precious metals (gold, copper, silver) as well as heavy metals that must not enter landfills or groundwater.",
        "preparation_instructions": "Back up and wipe personal data from electronic devices before disposal.",
        "safety_warning": "Do not attempt to burn cables or dismantle lithium battery packs manually.",
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Old Clothes & Textiles",
        "category": "Special Handling",
        "description": "Worn shirts, pants, bedsheets, and fabric cutoffs.",
        "disposal_instructions": "If usable, donate to clothing charities. If torn or soiled beyond wear, hand to textile recycling initiatives.",
        "recycling_information": "Cotton and synthetics can be shredded into industrial insulation, cleaning rags, or fiber fill.",
        "preparation_instructions": "Wash and dry thoroughly before donating or handing over to collection.",
        "safety_warning": None,
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Sanitary Pads & Diapers",
        "category": "Residual / Non-Recyclable",
        "description": "Used feminine hygiene products, baby diapers, and adult incontinence pads.",
        "disposal_instructions": "Wrap securely in old newspaper or disposal bags marked with a red dot. Place in residual / domestic hazardous bin.",
        "recycling_information": "Non-recyclable due to biological contamination and mixed plastic-absorbent polymer composition. Bound for sanitary landfills or medical incinerators.",
        "preparation_instructions": "Wrap securely to protect sanitation workers from direct contact.",
        "safety_warning": "Biological waste hazard. Never flush down toilets or discard into open compost.",
        "recyclable": False,
        "compostable": False,
    },
    {
        "name": "Broken Fluorescent Tubes & CFL Bulbs",
        "category": "Domestic Hazardous",
        "description": "Compact fluorescent lamps (CFLs) and fluorescent tube lights containing mercury vapor.",
        "disposal_instructions": "Take to hazardous waste collection points. Do not crush.",
        "recycling_information": "Certified mercury-retort recyclers can distill mercury and recover glass and aluminum end caps.",
        "preparation_instructions": "Wrap intact bulbs in cardboard sleeves or bubble wrap to prevent breaking in transit.",
        "safety_warning": "Contains toxic mercury vapor. If broken indoors, ventilate the room for 15 minutes before cleaning.",
        "recyclable": True,
        "compostable": False,
    },
    {
        "name": "Expired Medicines & Blister Packs",
        "category": "Domestic Hazardous",
        "description": "Expired pharmaceutical tablets, syrups, ointments, and medical blister foils.",
        "disposal_instructions": "Return to pharmacy take-back bins or drop off at municipal hazardous waste centers.",
        "recycling_information": "Must be incinerated at high temperatures at authorized hazardous waste facilities to avoid chemical contamination.",
        "preparation_instructions": "Keep in original packaging with labels intact so handlers can identify the substance.",
        "safety_warning": "Never flush down sinks or toilets, as medications contaminate municipal waterways and aquatic ecosystems.",
        "recyclable": False,
        "compostable": False,
    },
]


def seed_initial_data(db: Session):
    """
    Idempotently seeds initial waste items into the database.
    """
    existing_count = db.query(WasteItem).count()
    if existing_count > 0:
        return existing_count

    for item_data in INITIAL_WASTE_ITEMS:
        slug = slugify(item_data["name"])
        existing = db.query(WasteItem).filter(WasteItem.slug == slug).first()
        if not existing:
            item = WasteItem(
                name=item_data["name"],
                slug=slug,
                category=item_data["category"],
                description=item_data["description"],
                disposal_instructions=item_data["disposal_instructions"],
                recycling_information=item_data["recycling_information"],
                preparation_instructions=item_data["preparation_instructions"],
                safety_warning=item_data.get("safety_warning"),
                recyclable=item_data["recyclable"],
                compostable=item_data["compostable"],
            )
            db.add(item)
    db.commit()
    return len(INITIAL_WASTE_ITEMS)
