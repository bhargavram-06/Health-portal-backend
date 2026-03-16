const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Symptom = require('./models/Symptom');

dotenv.config();

const symptomsData = [
    { 
        name: "Fever", 
        medicine: "Paracetamol (Dolo 650)", 
        dosage: "1 tablet every 6 hours after a light meal", 
        diet: "Warm water, Rice porridge (Ganji), and Moong Dal Khichdi.", 
        precaution: "Monitor temp every 4 hours. Consult doctor if above 102°F.", 
        color: "text-emerald-600", iconName: "Thermometer" 
    },
    { 
        name: "Common Cold", 
        medicine: "Cetirizine (Okacet) / Sinarest", 
        dosage: "1 tablet at night before sleeping", 
        diet: "Ginger tea with honey. Avoid cold drinks and ice cream.", 
        precaution: "Steam inhalation twice daily. Keep neck and chest covered.", 
        color: "text-blue-600", iconName: "Wind" 
    },
    { 
        name: "Dry Cough", 
        medicine: "Ascoril-D / Grilinctus-DX", 
        dosage: "10ml syrup three times a day", 
        diet: "Soothe throat with honey and black pepper. Avoid spicy food.", 
        precaution: "Gargle with warm salt water. Avoid dusty environments.", 
        color: "text-orange-600", iconName: "Activity" 
    },
    { 
        name: "Wet Cough", 
        medicine: "Grilinctus-BM / Mucolite", 
        dosage: "10ml syrup twice daily after meals", 
        diet: "Warm vegetable broth. Avoid dairy as it thickens mucus.", 
        precaution: "Use an extra pillow to elevate your head while sleeping.", 
        color: "text-rose-600", iconName: "Droplets" 
    },
    { 
        name: "Sore Throat", 
        medicine: "Betadine Gargle / Strepsils", 
        dosage: "Mix 10ml with warm water and gargle 3 times daily", 
        diet: "Warm turmeric milk. Avoid cold water and oily pickles.", 
        precaution: "Rest your voice. Check for white spots in the throat.", 
        color: "text-indigo-600", iconName: "Thermometer" 
    },
    { 
        name: "Asthma Flare", 
        medicine: "Salbutamol Inhaler (Asthalin)", 
        dosage: "2 puffs as needed or as prescribed by your MD", 
        diet: "Magnesium-rich spinach and nuts. Eat small frequent meals.", 
        precaution: "Keep rescue inhaler handy. Avoid smoke and heavy dust.", 
        color: "text-violet-600", iconName: "Wind" 
    },
    { 
        name: "Sinusitis", 
        medicine: "Sinarest / Otrivin Nasal Spray", 
        dosage: "1 tablet twice daily or nasal spray as needed", 
        diet: "Spicy peppers and warm soups help clear nasal passages.", 
        precaution: "Apply warm compress over nose and forehead daily.", 
        color: "text-emerald-600", iconName: "Gauge" 
    },
    { 
        name: "Chest Congestion", 
        medicine: "Guaifenesin (Mucinex)", 
        dosage: "1 tablet every 12 hours with a full glass of water", 
        diet: "Warm fluids are essential. Avoid cold air conditioning.", 
        precaution: "Use a humidifier. Practice deep breathing exercises.", 
        color: "text-blue-600", iconName: "Brain" 
    },
    { 
        name: "Shortness of Breath", 
        medicine: "Oxygen Support / Emergency Call", 
        dosage: "Critical symptom; seek emergency care immediately", 
        diet: "Stay in a well-ventilated area. Avoid eating heavy meals.", 
        precaution: "Sit upright and stay calm. Do not lift heavy weights.", 
        color: "text-rose-700", iconName: "Activity" 
    },
    { 
        name: "Hay Fever", 
        medicine: "Fexofenadine (Allegra 120)", 
        dosage: "1 tablet daily after breakfast", 
        diet: "Organic honey. Stay hydrated to flush out allergens.", 
        precaution: "Keep windows closed during high pollen count mornings.", 
        color: "text-orange-600", iconName: "Wind" 
    },
    { 
        name: "Acidity", 
        medicine: "Pantoprazole (Pan-40) / Digene", 
        dosage: "1 tablet empty stomach 30 mins before breakfast", 
        diet: "Cold milk and coconut water. Avoid caffeine and pickles.", 
        precaution: "Walk for 15 mins after every meal. Do not lie down.", 
        color: "text-indigo-600", iconName: "Droplets" 
    },
    { 
        name: "Stomach Ache", 
        medicine: "Meftal-Spas / Cyclopam", 
        dosage: "1 tablet SOS when pain is severe after a meal", 
        diet: "Bananas, Rice, and Toast (BRAT). Fresh buttermilk.", 
        precaution: "Apply warm water bag. Check for lower right side pain.", 
        color: "text-violet-600", iconName: "Activity" 
    },
    { 
        name: "Diarrhea", 
        medicine: "Loperamide / Oflox-OZ", 
        dosage: "1 tablet after every loose motion (Max 3/day)", 
        diet: "ORS and curd rice. Avoid high-fiber raw vegetables.", 
        precaution: "Monitor urine color. Stay hydrated with electrolytes.", 
        color: "text-emerald-600", iconName: "Droplets" 
    },
    { 
        name: "Constipation", 
        medicine: "Dulcolax / Cremaffin Syrup", 
        dosage: "1 tablet or 10ml syrup at bedtime with warm water", 
        diet: "High-fiber papaya, oats, and leafy greens. 4L water.", 
        precaution: "Avoid processed Maida and bakery junk food.", 
        color: "text-blue-600", iconName: "Gauge" 
    },
    { 
        name: "Nausea", 
        medicine: "Ondansetron (Ondem) / Vomistop", 
        dosage: "1 tablet 30 minutes before your meal", 
        diet: "Sip ginger ale or lemon water. Small frequent snacks.", 
        precaution: "Avoid strong cooking smells and stuffy environments.", 
        color: "text-orange-600", iconName: "Brain" 
    },
    { 
        name: "Food Poisoning", 
        medicine: "Ofloxacin-OZ / Metrogyl", 
        dosage: "One tablet twice daily after a very light meal", 
        diet: "Liquids only for 12 hours. Gradually intro boiled rice.", 
        precaution: "Complete rest. If fever occurs, visit a medical clinic.", 
        color: "text-rose-600", iconName: "Droplets" 
    },
    { 
        name: "Bloating", 
        medicine: "Gas-X / Digene Gel", 
        dosage: "Chew 2 tablets slowly after heavy meals", 
        diet: "Fennel (Saunf) water. Avoid beans and carbonated soda.", 
        precaution: "Chew food thoroughly. Light walk after dinner.", 
        color: "text-indigo-600", iconName: "Activity" 
    },
    { 
        name: "Indigestion", 
        medicine: "Pudin Hara / Eno", 
        dosage: "Take as needed after meals; not on empty stomach", 
        diet: "Steamed vegetables and herbal teas. Avoid deep fried.", 
        precaution: "2-hour gap between dinner and sleep is mandatory.", 
        color: "text-violet-600", iconName: "Droplets" 
    },
    { 
        name: "Acid Reflux", 
        medicine: "Gelusil / Gaviscon Liquid", 
        dosage: "2 spoons of liquid 20 minutes after meals", 
        diet: "Oatmeal and cucumbers. Avoid chocolate and onions.", 
        precaution: "Sleep with head elevated. Avoid smoking and alcohol.", 
        color: "text-emerald-700", iconName: "Wind" 
    },
    { 
        name: "Vomiting", 
        medicine: "Domperidone (Domstal)", 
        dosage: "1 tablet before food or when uncontrollable", 
        diet: "Wait 1 hour then sip ORS very slowly. Soft foods only.", 
        precaution: "Check for blood in vomit or severe abdominal pain.", 
        color: "text-blue-500", iconName: "Droplets" 
    },
    { 
        name: "Migraine", 
        medicine: "Vasograin / Naproxen", 
        dosage: "1 tablet at the first sign of aura or onset", 
        diet: "Magnesium-rich almonds. Avoid aged cheese and red wine.", 
        precaution: "Rest in a dark quiet room. Use a cold compress.", 
        color: "text-rose-600", iconName: "Brain" 
    },
    { 
        name: "Tension Headache", 
        medicine: "Saridon / Crocin Advance", 
        dosage: "1 tablet with water; do not exceed 3 in 24 hours", 
        diet: "Hydration and consistent meals. Limit caffeine intake.", 
        precaution: "Improve sitting posture. Use neck heating pads.", 
        color: "text-orange-600", iconName: "Gauge" 
    },
    { 
        name: "Dizziness", 
        medicine: "Vertin / Stemetil", 
        dosage: "1 tablet twice daily after meals as prescribed", 
        diet: "Saline water (Salt+Sugar). Avoid sudden high sugar.", 
        precaution: "Sit down immediately when unsteady. Do not drive.", 
        color: "text-indigo-600", iconName: "Activity" 
    },
    { 
        name: "Insomnia", 
        medicine: "Melatonin / Ashwagandha", 
        dosage: "1 tablet 60 minutes before planned bedtime", 
        diet: "Chamomile tea. Avoid heavy spicy meals before sleep.", 
        precaution: "No screens 1 hour before bed. Keep room dark.", 
        color: "text-violet-600", iconName: "Brain" 
    },
    { 
        name: "Anxiety", 
        medicine: "Propranolol / Herbal Relaxants", 
        dosage: "As directed by MD during high stress periods", 
        diet: "Complex carbs like oats. Reduce caffeine and sugar.", 
        precaution: "Practice 5-minute Box Breathing daily for calm.", 
        color: "text-emerald-600", iconName: "Activity" 
    },
    { 
        name: "Panic Attack", 
        medicine: "Breathing / SOS Medicine", 
        dosage: "Follow the 4-7-8 breathing method immediately", 
        diet: "Avoid stimulants like energy drinks and strong coffee.", 
        precaution: "Use the 5-4-3-2-1 grounding method technique.", 
        color: "text-rose-600", iconName: "Brain" 
    },
    { 
        name: "Brain Fog", 
        medicine: "Omega-3 Fish Oil / Vitamin B12", 
        dosage: "1 capsule daily after your largest meal", 
        diet: "Walnuts, berries, and salmon. High protein intake.", 
        precaution: "Prioritize 8 hours of sleep. Take digital breaks.", 
        color: "text-blue-500", iconName: "Gauge" 
    },
    { 
        name: "Vertigo", 
        medicine: "Betahistine (Vertin 16)", 
        dosage: "1 tablet twice daily after meals", 
        diet: "Low sodium diet to reduce inner ear fluid pressure.", 
        precaution: "Rise slowly from bed. Sit a minute before standing.", 
        color: "text-orange-700", iconName: "Activity" 
    },
    { 
        name: "Back Pain", 
        medicine: "Zerodol-P / Ultracet", 
        dosage: "1 tablet twice daily after meals", 
        diet: "Calcium-rich milk and cheese. Turmeric and ginger.", 
        precaution: "Avoid heavy lifting. Use a firm sleeping mattress.", 
        color: "text-indigo-600", iconName: "Thermometer" 
    },
    { 
        name: "Muscle Cramp", 
        medicine: "Flexon / Magnesium Glycinate", 
        dosage: "1 tablet SOS with plenty of water", 
        diet: "Potassium-rich bananas and sweet potatoes. Coconut water.", 
        precaution: "Perform gentle stretches and massage the muscle.", 
        color: "text-violet-600", iconName: "Activity" 
    },
    { 
        name: "Joint Pain", 
        medicine: "Naproxen / Etoshine 90", 
        dosage: "1 tablet once daily after a heavy meal", 
        diet: "Walnuts and flaxseeds. Avoid excessive sugar/soda.", 
        precaution: "Apply warm compress. Opt for low-impact swimming.", 
        color: "text-emerald-600", iconName: "Activity" 
    },
    { 
        name: "Frozen Shoulder", 
        medicine: "Aceclofenac / Diclofenac Gel", 
        dosage: "Apply gel 3 times daily; 1 tablet after food", 
        diet: "Antioxidants like berries. Protein for tissue repair.", 
        precaution: "Keep the joint moving gently. Pendulum exercises.", 
        color: "text-blue-600", iconName: "Gauge" 
    },
    { 
        name: "Stiff Neck", 
        medicine: "Myospas / Flexon-MR", 
        dosage: "1 tablet after dinner for muscle relaxation", 
        diet: "Eggs and fortified cereals. High water intake.", 
        precaution: "Check pillow height. Use heating pad for 15 mins.", 
        color: "text-orange-600", iconName: "Wind" 
    },
    { 
        name: "Sprain", 
        medicine: "Ibuprofen / Volini Spray", 
        dosage: "1 tablet twice daily; apply spray every 4 hours", 
        diet: "Vitamin C fruits for collagen. Zinc-rich seeds.", 
        precaution: "R.I.C.E method: Rest, Ice, Compression, Elevation.", 
        color: "text-rose-700", iconName: "Activity" 
    },
    { 
        name: "Knee Pain", 
        medicine: "Glucosamine / Orthogel", 
        dosage: "Massage the gel gently twice a day", 
        diet: "Bone broth and citrus. Walnuts for joint lubrication.", 
        precaution: "Avoid deep squatting. Wear supportive footwear.", 
        color: "text-indigo-600", iconName: "Activity" 
    },
    { 
        name: "Skin Itching", 
        medicine: "Levocetirizine / Calamine Lotion", 
        dosage: "1 tablet at night; apply lotion SOS", 
        diet: "Cucumber and watermelon. Avoid spicy foods.", 
        precaution: "Avoid scratching. Use lukewarm water for bathing.", 
        color: "text-violet-600", iconName: "Droplets" 
    },
    { 
        name: "Acne Breakout", 
        medicine: "Benzoyl Peroxide / Clindamycin", 
        dosage: "Apply pea-sized amount to spots at bed", 
        diet: "Leafy greens and pumpkin seeds. Avoid white bread.", 
        precaution: "Never pop pimples. Change pillowcases weekly.", 
        color: "text-emerald-600", iconName: "Wind" 
    },
    { 
        name: "Fungal Infection", 
        medicine: "Luliconazole / Itraconazole", 
        dosage: "Apply cream twice daily after cleaning area", 
        diet: "Garlic and coconut oil. Avoid high-sugar items.", 
        precaution: "Keep area bone dry. Do not share bath towels.", 
        color: "text-blue-600", iconName: "Activity" 
    },
    { 
        name: "Eye Strain", 
        medicine: "Refresh Tears / Lubrex", 
        dosage: "1 drop into each eye every 6 hours", 
        diet: "Vitamin A carrots and kale. Omega-3 from fish.", 
        precaution: "20-20-20 rule. Adjust digital screen brightness.", 
        color: "text-orange-700", iconName: "Gauge" 
    },
    { 
        name: "Pink Eye", 
        medicine: "Moxifloxacin Drops / Ciplox", 
        dosage: "1 drop 4 times a day into the infected eye", 
        diet: "Immune boosters like citrus. Avoid outside food.", 
        precaution: "Wash hands often. Do not touch or rub eyes.", 
        color: "text-rose-600", iconName: "Activity" 
    },
    { 
        name: "Iron Deficiency", 
        medicine: "Orofer-XT / Folic Acid", 
        dosage: "1 tablet daily after dinner (No tea/coffee)", 
        diet: "Spinach, pomegranate, and jaggery with lemon.", 
        precaution: "No dairy within 2 hours of taking iron medicine.", 
        color: "text-indigo-600", iconName: "Droplets" 
    },
    { 
        name: "Vitamin B12 Def", 
        medicine: "Neurobion Forte / Methylcobalamin", 
        dosage: "1 tablet daily after your largest meal", 
        diet: "Eggs, curd, and milk. Fortified cereals.", 
        precaution: "Monitor for tingling or numbness in hands/feet.", 
        color: "text-violet-600", iconName: "Brain" 
    },
    { 
        name: "Vitamin D Def", 
        medicine: "Cholecalciferol 60K", 
        dosage: "1 capsule once a week with milk for 8 weeks", 
        diet: "Egg yolks and mushrooms. 15m morning sunlight.", 
        precaution: "Take with a meal containing some healthy fats.", 
        color: "text-emerald-600", iconName: "Gauge" 
    },
    { 
        name: "High Blood Pressure", 
        medicine: "Telmisartan 40 / Amlodipine", 
        dosage: "1 tablet daily at fixed morning time", 
        diet: "Strictly limit salt (DASH diet). Avoid snacks.", 
        precaution: "Monitor BP daily. Practice daily meditation.", 
        color: "text-rose-800", iconName: "Gauge" 
    },
    { 
        name: "High Blood Sugar", 
        medicine: "Metformin / Insulin", 
        dosage: "Strictly as per schedule given by MD", 
        diet: "Bitter gourd and whole grains. No white sugar.", 
        precaution: "Check glucose levels. Carry a sugar source SOS.", 
        color: "text-blue-700", iconName: "Droplets" 
    },
    { 
        name: "Thyroid Issues", 
        medicine: "Thyronorm / Eltroxin", 
        dosage: "1 tablet empty stomach 1 hour before tea", 
        diet: "Iodized salt in moderation. Include Brazil nuts.", 
        precaution: "TSH blood test every 3 months. Don't skip dose.", 
        color: "text-orange-700", iconName: "Gauge" 
    },
    { 
        name: "Kidney Stone Pain", 
        medicine: "Cystone / Painkillers", 
        dosage: "2 tablets Cystone twice daily with water", 
        diet: "Drink 4L water. Avoid spinach and tomato seeds.", 
        precaution: "Monitor urine color. Seek help if fever occurs.", 
        color: "text-indigo-700", iconName: "Droplets" 
    },
    { 
        name: "Mouth Ulcers", 
        medicine: "Zytee Gel / B-Complex", 
        dosage: "Apply gel locally 5 mins before meals", 
        diet: "Soft bland foods and cool buttermilk (Chaas).", 
        precaution: "Use soft-bristled brush. Salt water rinses.", 
        color: "text-violet-600", iconName: "Droplets" 
    },
    { 
        name: "Ear Pain", 
        medicine: "Otogesic Drops / Paracetamol", 
        dosage: "2 drops into affected ear 3 times daily", 
        diet: "Hydration to thin mucus. Avoid very cold foods.", 
        precaution: "Keep ear bone dry. Do not use swabs inside.", 
        color: "text-emerald-600", iconName: "Wind" 
    },
    { 
        name: "Toothache", 
        medicine: "Ketorol-DT / Clove Oil", 
        dosage: "Dissolve 1 tablet in water and drink", 
        diet: "Soft yogurt and mashed potatoes. Avoid heat.", 
        precaution: "Visit dentist. Do not place aspirin on gums.", 
        color: "text-blue-600", iconName: "Activity" 
    },
    { 
        name: "Heat Stroke", 
        medicine: "ORS / Paracetamol", 
        dosage: "Sip ORS every 10 mins; 1 tablet for fever", 
        diet: "Watermelon and cucumber. Avoid heavy caffeine.", 
        precaution: "Move to cool shade immediately. Seek MD help.", 
        color: "text-orange-800", iconName: "Thermometer" 
    },
    { 
        name: "Morning Sickness", 
        medicine: "Doxinate / Ginger Tabs", 
        dosage: "1 tablet before bedtime for next morning", 
        diet: "Eat crackers before getting out of bed. Lemon water.", 
        precaution: "Avoid spicy or fragrant foods. Rise very slowly.", 
        color: "text-rose-600", iconName: "Activity" 
    },
    { 
        name: "Sunburn Relief", 
        medicine: "Aloe Vera / Calamine", 
        dosage: "Apply liberally 4 times daily to skin", 
        diet: "Extra water intake. Eat antioxidant-rich berries.", 
        precaution: "Do not peel skin. Wear loose cotton clothing.", 
        color: "text-orange-400", iconName: "Droplets" 
    },
    { 
        name: "Tinnitus", 
        medicine: "Ginkgo Biloba / Multivitamins", 
        dosage: "1 tablet daily after breakfast", 
        diet: "Low salt intake. Avoid alcohol and heavy caffeine.", 
        precaution: "Use white noise at night. Avoid loud sound zones.", 
        color: "text-indigo-500", iconName: "Wind" 
    },
    { 
        name: "Gum Swelling", 
        medicine: "Chlorhexidine Mouthwash", 
        dosage: "Rinse twice daily after brushing teeth", 
        diet: "Apples and carrots. Avoid sugary sticky candies.", 
        precaution: "Daily flossing. Professional dental cleaning.", 
        color: "text-emerald-600", iconName: "Droplets" 
    },
    { 
        name: "Varicose Veins", 
        medicine: "Daflon / Compression Socks", 
        dosage: "Wear stockings throughout the day", 
        diet: "High-fiber foods. Flavonoids found in grapes.", 
        precaution: "Elevate legs above heart level while resting.", 
        color: "text-rose-700", iconName: "Droplets" 
    },
    { 
        name: "Pinch Nerve", 
        medicine: "Gabapentin / Vitamin B12", 
        dosage: "1 tablet nightly to reduce tingling sensation", 
        diet: "Fortified cereals and nuts. Consistent hydration.", 
        precaution: "Postural correction. Gentle nerve-glide stretches.", 
        color: "text-violet-600", iconName: "Activity" 
    },
    { 
        name: "Severe Fatigue", 
        medicine: "BCAA / Multivitamin", 
        dosage: "1 capsule daily after breakfast for energy", 
        diet: "Oats, bananas, and high protein. Chocolate milk.", 
        color: "text-orange-500", iconName: "Gauge" 
    },
    { 
        name: "Nightmares", 
        medicine: "Relaxation / Melatonin", 
        dosage: "Use sleep aids only as MD prescribed", 
        diet: "Chamomile tea. Avoid heavy spicy late-night meals.", 
        precaution: "Maintain dark, peaceful sleep environment.", 
        color: "text-blue-700", iconName: "Brain" 
    },
    { 
        name: "Nosebleed", 
        medicine: "Saline Nasal Spray", 
        dosage: "2 times daily to keep nasal lining moist", 
        diet: "Leafy greens for Vitamin K blood clotting.", 
        precaution: "Sit upright, lean forward, pinch nose bridge.", 
        color: "text-red-700", iconName: "Droplets" 
    },
    { 
        name: "Shin Splints", 
        medicine: "Ibuprofen / Ice Compress", 
        dosage: "1 tablet twice daily after leg activity", 
        diet: "Turmeric milk. Calcium and Vitamin D-rich diet.", 
        precaution: "Replace running shoes. Avoid hard concrete runs.", 
        color: "text-blue-600", iconName: "Activity" 
    },
    { 
        name: "Wrist RSI", 
        medicine: "NSAID Gel / Wrist Splint", 
        dosage: "Apply gel locally 3 times daily", 
        diet: "B6 rich bananas and chickpeas. Ligament health.", 
        precaution: "5-min stretch every hour of computer use.", 
        color: "text-emerald-700", iconName: "Gauge" 
    },
    { 
        name: "Edema", 
        medicine: "Diuretics / Magnesium", 
        dosage: "1 tablet in morning if prescribed by MD", 
        diet: "Strictly low salt. Potassium-rich bananas.", 
        precaution: "Elevate legs. Avoid standing for long hours.", 
        color: "text-blue-500", iconName: "Droplets" 
    },
    { 
        name: "Angina Pain", 
        medicine: "Sorbitrate / Aspirin", 
        dosage: "Place tablet under tongue during pain SOS", 
        diet: "Heart-healthy oats and garlic. No saturated fat.", 
        precaution: "Stop all activity. Sit. Call ER if > 5 mins.", 
        color: "text-rose-900", iconName: "Thermometer" 
    },
    { 
        name: "Psoriasis", 
        medicine: "Coal Tar / Salicylic Acid", 
        dosage: "Apply ointment twice daily to dry patches", 
        diet: "Omega-3 fish and flaxseeds. Avoid dairy triggers.", 
        precaution: "Keep skin moisturized. Manage mental stress.", 
        color: "text-orange-700", iconName: "Activity" 
    },
    { 
        name: "Hyperthyroid", 
        medicine: "Methimazole / Carbimazole", 
        dosage: "1 tablet daily as per specialist schedule", 
        diet: "Cruciferous broccoli. Avoid high-iodine seaweed.", 
        precaution: "Monitor heart rate. Regular blood T3/T4 checks.", 
        color: "text-indigo-700", iconName: "Gauge" 
    },
    { 
        name: "Hypocalcemia", 
        medicine: "Calcium Carbonate", 
        dosage: "1 tablet after lunch; needs Vitamin D3", 
        diet: "Ragi, milk, and almonds. Avoid excessive soda.", 
        precaution: "Monitor for muscle cramps or finger tingling.", 
        color: "text-emerald-600", iconName: "Activity" 
    },
    { 
        name: "Low Sugar SOS", 
        medicine: "Glucose Powder / Juice", 
        dosage: "Consume 15g fast sugar immediately on onset", 
        diet: "Protein snack after stability. Don't skip meals.", 
        precaution: "Always carry candy. Identify exercise triggers.", 
        color: "text-orange-600", iconName: "Droplets" 
    },
    { 
        name: "Lipid Disorder", 
        medicine: "Fenofibrate / Atorva", 
        dosage: "1 tablet daily after dinner for absorption", 
        diet: "High fiber oats and green veggies. No alcohol.", 
        precaution: "45 mins cardio daily. Check lipid profile q3m.", 
        color: "text-blue-700", iconName: "Gauge" 
    },
    { 
        name: "Jet Lag Flare", 
        medicine: "Melatonin / Sleep Tea", 
        dosage: "Take 30 mins before target bed in new zone", 
        diet: "Plain water only. Avoid alcohol during flights.", 
        precaution: "Morning sunlight reset. Avoid long daytime naps.", 
        color: "text-cyan-600", iconName: "Brain" 
    },
    { 
        name: "Shoulder Issues", 
        medicine: "Aceclofenac / Ice pack", 
        dosage: "Apply ice 15 mins q4h; 1 tablet after food", 
        diet: "Protein-rich pulses and lean meat for repair.", 
        precaution: "Avoid overhead lifting. Physical therapy essential.", 
        color: "text-stone-700", iconName: "Activity" 
    },
    { 
        name: "Low Platelet Care", 
        medicine: "Caripill / Papaya Extract", 
        dosage: "1 tablet 3 times a day during infection", 
        diet: "Papaya leaf juice and pomegranate. Leafy greens.", 
        precaution: "Avoid injury risk. Check for bleeding gums.", 
        color: "text-rose-800", iconName: "Droplets" 
    },
    { 
        name: "Eye Dryness", 
        medicine: "Carboxymethylcellulose", 
        dosage: "1 drop in each eye 4 times daily", 
        diet: "Hydration and walnuts. Avoid fans blowing on eyes.", 
        precaution: "Use warm eyelid compress. Follow 20-20-20 rule.", 
        color: "text-blue-500", iconName: "Droplets" 
    },
    { 
        name: "Heel Spur Pain", 
        medicine: "Ibuprofen / Ortho Pads", 
        dosage: "Place pads in shoes; 1 tablet SOS after meals", 
        diet: "Anti-inflammatory ginger and fatty fish diet.", 
        precaution: "Avoid walking barefoot. Morning foot stretches.", 
        color: "text-emerald-700", iconName: "Activity" 
    },
    { 
        name: "Skin Sunburn", 
        medicine: "Silverex / Aloe Vera", 
        dosage: "Apply thick layer twice daily to burned area", 
        diet: "Increase water and Vitamin C fruit intake.", 
        precaution: "No toothpaste on burn. Cool running water first.", 
        color: "text-rose-600", iconName: "Droplets" 
    },
    { 
        name: "General Itch", 
        medicine: "Antihistamine / Calamine", 
        dosage: "1 tablet nightly; apply lotion locally", 
        diet: "Cooling cucumber. Avoid seafood and spicy oils.", 
        precaution: "Keep nails short. Use mild soap for bathing.", 
        color: "text-pink-600", iconName: "Wind" 
    },
    { 
        name: "Dandruff Relief", 
        medicine: "Ketoconazole Shampoo", 
        dosage: "Use twice weekly; leave on scalp for 5 mins", 
        diet: "Zinc and B6 rich eggs and fish. Less oily food.", 
        precaution: "Wash combs daily. Avoid sharp nail scratching.", 
        color: "text-slate-600", iconName: "Wind" 
    },
    { 
        name: "Lower Back Strain", 
        medicine: "Flexon-MR / Volini", 
        dosage: "1 tablet after dinner; apply spray SOS", 
        diet: "Vitamin B12 rich eggs and lean meats. Calcium.", 
        precaution: "Check posture. Use lumbar support in chairs.", 
        color: "text-indigo-600", iconName: "Activity" 
    },
    { 
        name: "Hives Rash", 
        medicine: "Fexofenadine / Avil", 
        dosage: "1 tablet SOS when welts appear on skin", 
        diet: "Low histamine diet. Avoid spinach and strawberries.", 
        precaution: "Identify trigger allergen. Wear loose cotton.", 
        color: "text-red-700", iconName: "Activity" 
    },
    { 
        name: "Iron Flare", 
        medicine: "Ferrous Ascorbate", 
        dosage: "Take 10ml syrup q12h after major meals", 
        diet: "Dates and pomegranate. Boost with orange juice.", 
        precaution: "Monitor Hb levels q1m. No tea after medicine.", 
        color: "text-red-600", iconName: "Droplets" 
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚀 Connected to MongoDB...");

        // programmatic duplicate filter
        const uniqueSymptoms = Array.from(new Map(symptomsData.map(item => [item.name, item])).values());
        
        await Symptom.deleteMany({});
        console.log("Emptying database to ensure fresh theme start...");

        await Symptom.insertMany(uniqueSymptoms);
        
        console.log(`✅ Success! Added ${uniqueSymptoms.length} themed symptoms with rotating colors.`);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();