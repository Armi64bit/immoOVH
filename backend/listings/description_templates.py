def build_property_description(property_obj):
    """Build a useful initial French description from a listing's structured data."""
    location = property_obj.location or "un secteur recherché du Grand Tunis"
    details = property_obj.details or "des volumes bien pensés"
    features = property_obj.features or []
    feature_text = ", ".join(features[:4])

    if property_obj.property_type == "Terrain":
        opening = f"Ce terrain situé à {location} offre une belle base pour un projet résidentiel ou professionnel."
    elif property_obj.property_type in {"Villa / Maison", "Duplex / Triplex"}:
        opening = f"Cette propriété située à {location} propose un cadre de vie généreux, pensé pour conjuguer confort et intimité."
    elif property_obj.property_type in {"Bureau / Espace professionnel", "Local commercial"}:
        opening = f"Ce bien professionnel situé à {location} bénéficie d'un emplacement adapté à une activité visible et accessible."
    elif property_obj.property_type == "Studio":
        opening = f"Ce studio situé à {location} constitue une adresse pratique et contemporaine, idéale pour un premier projet ou un investissement locatif."
    else:
        opening = f"Cet appartement situé à {location} offre une adresse agréable et des espaces faciles à personnaliser selon votre projet."

    details_sentence = f"Il propose {details}."
    feature_sentence = f"Ses atouts comprennent {feature_text}." if feature_text else "Ses volumes permettent un aménagement fonctionnel et élégant."
    closing = "ImmoConnect vous accompagne pour découvrir le bien, répondre à vos questions et organiser une visite."
    return f"{opening} {details_sentence} {feature_sentence} {closing}"
