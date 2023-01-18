export interface ItemDetailsResponse {
    Response: Response
    ErrorCode: number
    ThrottleSeconds: number
    ErrorStatus: string
    Message: string
    MessageData: MessageData
  }
  
  export interface Response {
    displayProperties: DisplayProperties
    tooltipNotifications: TooltipNotification[]
    collectibleHash: number
    iconWatermark: string
    iconWatermarkShelved: string
    backgroundColor: BackgroundColor
    screenshot: string
    itemTypeDisplayName: string
    flavorText: string
    uiItemDisplayStyle: string
    itemTypeAndTierDisplayName: string
    displaySource: string
    action: Action
    inventory: Inventory
    stats: Stats
    equippingBlock: EquippingBlock
    translationBlock: TranslationBlock
    preview: Preview
    quality: Quality
    acquireRewardSiteHash: number
    acquireUnlockHash: number
    sockets: Sockets
    talentGrid: TalentGrid
    investmentStats: InvestmentStat[]
    perks: Perk[]
    summaryItemHash: number
    allowActions: boolean
    doesPostmasterPullHaveSideEffects: boolean
    nonTransferrable: boolean
    itemCategoryHashes: number[]
    specialItemType: number
    itemType: number
    itemSubType: number
    classType: number
    breakerType: number
    equippable: boolean
    damageTypeHashes: number[]
    damageTypes: number[]
    defaultDamageType: number
    defaultDamageTypeHash: number
    isWrapper: boolean
    traitIds: string[]
    traitHashes: number[]
    hash: number
    index: number
    redacted: boolean
    blacklisted: boolean
  }
  
  export interface DisplayProperties {
    description: string
    name: string
    icon: string
    hasIcon: boolean
  }
  
  export interface TooltipNotification {
    displayString: string
    displayStyle: string
  }
  
  export interface BackgroundColor {
    red: number
    green: number
    blue: number
    alpha: number
  }
  
  export interface Action {
    verbName: string
    verbDescription: string
    isPositive: boolean
    requiredCooldownSeconds: number
    requiredItems: any[]
    progressionRewards: any[]
    actionTypeLabel: string
    rewardSheetHash: number
    rewardItemHash: number
    rewardSiteHash: number
    requiredCooldownHash: number
    deleteOnAction: boolean
    consumeEntireStack: boolean
    useOnAcquire: boolean
  }
  
  export interface Inventory {
    maxStackSize: number
    bucketTypeHash: number
    recoveryBucketTypeHash: number
    tierTypeHash: number
    isInstanceItem: boolean
    nonTransferrableOriginal: boolean
    tierTypeName: string
    tierType: number
    expirationTooltip: string
    expiredInActivityMessage: string
    expiredInOrbitMessage: string
    suppressExpirationWhenObjectivesComplete: boolean
  }
  
  export interface Stats {
    disablePrimaryStatDisplay: boolean
    statGroupHash: number
    stats: {
        key: {
            statHash: number
            value: number
            minimum: number
            maximum: number
            displayMaximum: number
        }
    }
    hasDisplayableStats: boolean
    primaryBaseStatHash: number
  }
  
  export interface EquippingBlock {
    uniqueLabelHash: number
    equipmentSlotTypeHash: number
    attributes: number
    equippingSoundHash: number
    hornSoundHash: number
    ammoType: number
    displayStrings: string[]
  }
  
  export interface TranslationBlock {
    weaponPatternHash: number
    defaultDyes: DefaultDye[]
    lockedDyes: any[]
    customDyes: any[]
    arrangements: Arrangement[]
    hasGeometry: boolean
  }
  
  export interface DefaultDye {
    channelHash: number
    dyeHash: number
  }
  
  export interface Arrangement {
    classHash: number
    artArrangementHash: number
  }
  
  export interface Preview {
    screenStyle: string
    previewVendorHash: number
    previewActionString: string
  }
  
  export interface Quality {
    itemLevels: any[]
    qualityLevel: number
    infusionCategoryName: string
    infusionCategoryHash: number
    infusionCategoryHashes: number[]
    progressionLevelRequirementHash: number
    currentVersion: number
    versions: Version[]
    displayVersionWatermarkIcons: string[]
  }
  
  export interface Version {
    powerCapHash: number
  }
  
  export interface Sockets {
    detail: string
    socketEntries: SocketEntry[]
    intrinsicSockets: IntrinsicSocket[]
    socketCategories: SocketCategory[]
  }
  
  export interface SocketEntry {
    socketTypeHash: number
    singleInitialItemHash: number
    reusablePlugItems: ReusablePlugItem[]
    preventInitializationOnVendorPurchase: boolean
    preventInitializationWhenVersioning: boolean
    hidePerksInItemTooltip: boolean
    plugSources: number
    reusablePlugSetHash?: number
    overridesUiAppearance: boolean
    defaultVisible: boolean
    randomizedPlugSetHash?: number
  }
  
  export interface ReusablePlugItem {
    plugItemHash: number
  }
  
  export interface IntrinsicSocket {
    plugItemHash: number
    socketTypeHash: number
    defaultVisible: boolean
  }
  
  export interface SocketCategory {
    socketCategoryHash: number
    socketIndexes: number[]
  }
  
  export interface TalentGrid {
    talentGridHash: number
    itemDetailString: string
    hudDamageType: number
  }
  
  export interface InvestmentStat {
    statTypeHash: number
    value: number
    isConditionallyActive: boolean
  }
  
  export interface Perk {
    requirementDisplayString: string
    perkHash: number
    perkVisibility: number
  }
  
  export interface MessageData {}
  