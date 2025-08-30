# Small demo knowledge base. Replace with authoritative sources for production.
DRUGS = {
    'paracetamol': {
        'aliases': ['paracetamol', 'acetaminophen', 'tylenol'],
        'classes': ['analgesic', 'antipyretic'],
        'description': 'Pain and fever reducer.'
    },
    'ibuprofen': {
        'aliases': ['ibuprofen', 'advil', 'motrin'],
        'classes': ['NSAID', 'analgesic'],
        'description': 'Non-steroidal anti-inflammatory for pain and inflammation.'
    },
    'amoxicillin': {
        'aliases': ['amoxicillin', 'amox'],
        'classes': ['antibiotic', 'penicillin'],
        'description': 'Aminopenicillin antibiotic for bacterial infections.'
    },
    'metformin': {
        'aliases': ['metformin', 'glucophage'],
        'classes': ['antidiabetic', 'biguanide'],
        'description': 'First-line oral therapy for type 2 diabetes.'
    },
    'atorvastatin': {
        'aliases': ['atorvastatin', 'lipitor'],
        'classes': ['statin', 'lipid-lowering'],
        'description': 'HMG-CoA reductase inhibitor for hyperlipidemia.'
    },
    'aspirin': {
        'aliases': ['aspirin', 'acetylsalicylic acid'],
        'classes': ['antiplatelet', 'NSAID'],
        'description': 'Antiplatelet agent used for cardiovascular protection and pain.'
    }
}

INTERACTIONS = {
    'ibuprofen': [
        {'with': 'aspirin', 'severity': 'moderate', 'explanation': "Ibuprofen may interfere with aspirin's antiplatelet effect; separate dosing or prefer acetaminophen."}
    ],
    'amoxicillin': [
        {'with': 'warfarin', 'severity': 'moderate', 'explanation': 'May increase INR; monitor anticoagulation.'}
    ],
    'atorvastatin': [
        {'with': 'clarithromycin', 'severity': 'high', 'explanation': 'CYP3A4 inhibition increases statin levels; risk of rhabdomyolysis.'}
    ],
    'metformin': [
        {'with': 'cimetidine', 'severity': 'moderate', 'explanation': 'May increase metformin levels; consider alternatives or dose adjustment.'}
    ]
}

ALTERNATIVES = {
    'ibuprofen': [{'suggestion': 'Paracetamol (Acetaminophen) for pain/fever', 'reason': 'Lower GI risk; no antiplatelet interference.'}],
    'amoxicillin': [{'suggestion': 'Azithromycin (if penicillin allergy)', 'reason': 'Macrolide alternative for common respiratory infections.'}],
    'metformin': [{'suggestion': 'Metformin XR or add GLP-1 RA per guidelines', 'reason': 'Improves GI tolerance and adds glycemic/weight benefits.'}]
}
